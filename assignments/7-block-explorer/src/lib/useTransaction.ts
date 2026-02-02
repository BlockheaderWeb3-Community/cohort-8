/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useApiService } from './api/useApiService';
import { ETH_BLOCK_NUMBER, ETH_GET_BLOCK_BY_NUMBER } from '@/constant';
import { hexToDecimal } from './utils';

const useTransaction = () => {
  const { useMutation } = useApiService();

  const [latestBlockNumber, setLatestBlockNumber] = useState<number | null>(
    null
  );
  const [recentBlocks, setRecentBlocks] = useState<any>([]);
  const [finalizedBlockNumber, setFinalizedBlockNumber] = useState<
    number | null
  >(null);
  const [safeBlockNumber, setSafeBlockNumber] = useState<number | null>(null);
  console.log('Recent Blocks:', recentBlocks);

  const { mutateAsync: fetchBlockNumber, isPending: isBlockNumberLoading } =
    useMutation<any>({});

  const {
    mutateAsync: fetchBlockByNumber,
    isPending: isfetchingBlockByNumber,
  } = useMutation<any>({});

  const handleFetchBlockNumber = async () => {
    const data = await fetchBlockNumber({
      method: ETH_BLOCK_NUMBER,
      params: [],
      id: 83,
    });
    const decimalBlockNumber = hexToDecimal(data?.result);
    setLatestBlockNumber(decimalBlockNumber);
    for (let i = 0; i < 5; i++) {
      const blockData = await fetchBlockByNumber({
        method: ETH_GET_BLOCK_BY_NUMBER,
        params: [decimalBlockNumber - i, true],
        id: 84,
      });
      setRecentBlocks((prevBlocks: any) => [...prevBlocks, blockData.result]);
    }
  };

  const handleGetFinalisedBlockNumber = async () => {
    const blockData = await fetchBlockByNumber({
      method: ETH_GET_BLOCK_BY_NUMBER,
      params: ['finalized', true],
      id: 84,
    });
    setFinalizedBlockNumber(hexToDecimal(blockData?.result?.number));
  };

  const handleGetSafeBlockNumber = async () => {
    const blockData = await fetchBlockByNumber({
      method: ETH_GET_BLOCK_BY_NUMBER,
      params: ['safe', true],
      id: 84,
    });
    setSafeBlockNumber(hexToDecimal(blockData?.result?.number));
  };

  useEffect(() => {
    handleFetchBlockNumber();
    handleGetFinalisedBlockNumber();
    handleGetSafeBlockNumber();
  }, []);

  return {
    transactions: recentBlocks[0]?.transactions.splice(0, 5) || [],
    transactionsLoading: isfetchingBlockByNumber,
    blocks: recentBlocks,
    blocksLoading: isfetchingBlockByNumber,
    finalizedBlockNumber,
    safeBlockNumber,
  };
};

export default useTransaction;
