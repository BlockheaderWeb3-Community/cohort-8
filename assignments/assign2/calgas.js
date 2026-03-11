/**
 * Calculate total gas fee.
 *
  @param {number} gasUsed            - gas used (or gas limit for an estimate)
   @param {number} baseFeePerGasGwei  - base fee per gas in gwei
   @param {number} priorityFeeGwei    - tip per gas in gwei
  @returns {{ totalFeeGwei: number, totalFeeEth: number, effectiveGasPriceGwei: number }}
 */
function calculateGasFee(gasUsed, baseFeePerGasGwei, priorityFeeGwei) {
  const effectiveGasPriceGwei = baseFeePerGasGwei + priorityFeeGwei;
  const totalFeeGwei = gasUsed * effectiveGasPriceGwei;

  // 1 ETH = 1e9 gwei
  const totalFeeEth = totalFeeGwei / 1e9;

  return {
    effectiveGasPriceGwei,
    totalFeeGwei,
    totalFeeEth,
  };
}

const gasUsed = 21000; // simple transfer
const baseFeePerGasGwei = 10; // example current base fee
const priorityFeeGwei = 2; // your tip

console.log(calculateGasFee(gasUsed, baseFeePerGasGwei, priorityFeeGwei));
// -> { effectiveGasPriceGwei: 12, totalFeeGwei: 252000, totalFeeEth: 0.000252 }
