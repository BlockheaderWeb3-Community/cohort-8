/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useApiService } from './api/useApiService';
import { ETH_GET_BLOCK_BY_NUMBER } from '@/constant';
import { useParams } from 'next/navigation';
import { hexToDecimal } from './utils';

const useBlockDetails = () => {
  const { useMutation } = useApiService();
  const { blockNumber } = useParams();

  const [blockDetails, setBlockDetails] = React.useState<any>(null);
  const [finalizedBlockNumber, setFinalizedBlockNumber] =
    React.useState<any>(null);

  const {
    mutateAsync: fetchBlockByNumber,
    isPending: isFetchingBlockByNumber,
  } = useMutation<any>({});

  const handleGetBlockDetails = async () => {
    const blockData = await fetchBlockByNumber({
      method: ETH_GET_BLOCK_BY_NUMBER,
      params: [blockNumber, true],
      id: 84,
    });
    setBlockDetails(blockData?.result);
  };

  const handleGetFinalisedBlock = async () => {
    const blockData = await fetchBlockByNumber({
      method: ETH_GET_BLOCK_BY_NUMBER,
      params: ['finalized', true],
      id: 84,
    });
    setFinalizedBlockNumber(hexToDecimal(blockData?.result?.number));
  };

  useEffect(() => {
    handleGetBlockDetails();
    handleGetFinalisedBlock();
  }, []);

  return {
    blockDetails,
    isFetchingBlockByNumber,
    finalizedBlockNumber,
    blockNumber,
  };
};

export default useBlockDetails;
