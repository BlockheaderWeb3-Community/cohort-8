'use client'

import Item from "./OverviewItem"

const weiToEth = (wei: string) =>
  Number(BigInt(wei)) / 1e18

const gweiFromWei = (wei: string) =>
  Number(BigInt(wei)) / 1e9

const formatTimestamp = (timestampHex: string) => {
  const ts = parseInt(timestampHex, 16) * 1000
  const date = new Date(ts)
  return date.toUTCString()
}

const Overview = ({ block }: { block: any }) => {
  if (!block) return null

  const burntFeesWei = (BigInt(block.baseFeePerGas) * BigInt(block.gasUsed)).toString();
   const burntFeesEth = weiToEth(burntFeesWei);

  const blockNumber = parseInt(block.number, 16)
  const gasUsed = parseInt(block.gasUsed, 16)
  const gasLimit = parseInt(block.gasLimit, 16)
  const size = parseInt(block.size, 16)
  const txCount = block.transactions.length

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0e14] p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Block <span className="text-blue-600">#{blockNumber}</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">

        <Item label="Block Height" value={blockNumber} />

        <Item
          label="Status"
          value={
            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              Unfinalized
            </span>
          }
        />

        <Item
          label="Timestamp"
          value={formatTimestamp(block.timestamp)}
        />

        <Item
          label="Transactions"
          value={`${txCount} transactions`}
        />

        <Item
          label="Withdrawals"
          value={`${block.withdrawals?.length ?? 0} withdrawals`}
        />

        <Item
          label="Fee Recipient"
          value={
            <span className="text-blue-600 break-all">
              {block.miner}
            </span>
          }
        />

        <Item
          label="Gas Used"
          value={`${gasUsed.toLocaleString()} (${(
            (gasUsed / gasLimit) *
            100
          ).toFixed(2)}%)`}
        />

        <Item label="Gas Limit" value={gasLimit.toLocaleString()} />
        <Item label="Size" value={`${size.toLocaleString()} bytes`} />

        <Item
          label="Base Fee Per Gas"
          value={`${gweiFromWei(block.baseFeePerGas).toFixed(9)} Gwei`}
        />

        <Item
          label="Burnt Fees"
          value={
            <span className="text-orange-600 font-medium">
              🔥{burntFeesEth.toFixed(6)} ETH
            </span>
          }
        />

        <Item
          label="Extra Data"
          value={
            <div className="break-all text-xs text-gray-500">
              {block.extraData}
            </div>
          }
        />

      </div>
    </div>
  )
}

export default Overview
