import LatestBlocks from 'src/components/ui/LatestBlocks';
import LatestTransactions from 'src/components/ui/LatestTransactions';
import { useEthPrice, useGasPrice } from 'src/hooks/useSepolia';
import { weiToGwei, weiToEth } from '~/src/services/formatters';
import LoadingSpinner from 'src/components/ui/LoadingSpinner';
import ErrorMessage from 'src/components/ui/ErrorMessage';

export default function HomePage() {
  const {
    data: ethPrice,
    isLoading: ethPriceLoading,
    error: ethPriceError,
  } = useEthPrice();

  const {
    data: gasPrice,
    isLoading: gasPriceLoading,
    error: gasPriceError,
  } = useGasPrice();

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-col gap-6 w-full h-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
          {/* Eth Price */}
          <div className="p-4 rounded-lg bg-sepolia-dark">
            <h3 className="font-bold">ETH Price</h3>
            {ethPriceLoading ? (
              <LoadingSpinner />
            ) : ethPriceError ? (
              <ErrorMessage message={ethPriceError.message} />
            ) : (
              <p>${ethPrice?.toFixed(2)}</p>
            )}
          </div>

          {/* Gas Price */}
          <div className="p-4 rounded-lg bg-sepolia-dark">
            <h3 className="font-bold">Gas Price</h3>
            {gasPriceLoading ? (
              <LoadingSpinner />
            ) : gasPriceError ? (
              <ErrorMessage message={gasPriceError.message} />
            ) : (
              <p>{weiToGwei(gasPrice || '0').toFixed(2)} Gwei</p>
            )}
          </div>
        </div>

        <div className="grid h-full w-full grid-cols-1 p-4 gap-20 lg:gap-6 lg:grid-cols-2">
          <LatestBlocks />
          <LatestTransactions />
        </div>
      </div>
    </div>
  );
}
