'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { latestTransactions } from '../utils/obj' // keep static transactions for now
import { getBlockByNumber } from '../utils/jsonrpc'
import { FaCube } from 'react-icons/fa'
import { LatestTransactions } from './transaction'

const Section = () => {
  const [latestBlocks, setLatestBlocks] = useState<any[]>([])
  //const [latestTransactions, setLatestTransactions] = useState<any[]>([])

  useEffect(() => {
    const fetchLatestBlocks = async () => {
      try {
      
        const res = await axios.post('https://ethereum-rpc.publicnode.com', {
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })

        const latestHex = res.data.result
        console.log('Latest Block Hex:', latestHex)
        const latestDecimal = parseInt(latestHex, 16)

    
        const blockPromises = []
        for (let i = 0; i < 12; i++) {
          const blockNumberHex = '0x' + (latestDecimal - i).toString(16)
          console.log('Fetching block number (hex):', blockNumberHex)
          blockPromises.push(getBlockByNumber(blockNumberHex, false, i+1)
          )
        }

        const blocksResponses = await Promise.all(blockPromises)

        
        const formattedBlocks = blocksResponses
        .filter(b => b !== null && b?.data?.result) 
        .map((b: any, index: number) => {
          const block = b.data.result
          console.log('Block Data:', block)
          const txTime = new Date().toLocaleTimeString() // optional: approximate
          return {
            id: index,
            blockNumber: parseInt(block.number, 16),
            time: new Date(parseInt(block.timestamp, 16) * 1000).toLocaleString(),
            miner: block.miner,
            txCount: block.transactions.length,
            txTime: txTime,
            reward: '0.0 ETH', 
            icon: <FaCube className="text-green-500 w-6 h-6" />, // optional icon
          }
        })

        setLatestBlocks(formattedBlocks)
      } catch (error) {
        console.error('Error fetching latest blocks:', error)
      }
    }
   //const data =  getBlockByNumber(latestHex, true, 1)

    fetchLatestBlocks()

    //const interval = setInterval(fetchLatestBlocks, 5000)
    //return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-7 flex justify-evenly mt-4 gap-4">
      {/* Section 1: Latest Blocks */}
      <div className="border-2 border-green-700 rounded-xl p-4 w-1/2 shadow-lg">
        <div className="font-bold text-gray-500 mb-2">Latest Blocks</div>

        {latestBlocks.map((block) => (
          <Link
            href={`/block/${block.blockNumber}`}
            key={block.id}
            className="flex items-center justify-between gap-3 p-3 rounded-md border-b-2 border-green-700/30 hover:bg-green-50 transition"
          >
            {/* Icon */}
            <div className="flex-shrink-0">{block.icon}</div>

            {/* Block Number & Time */}
            <div className="flex flex-col">
              <div className="font-semibold text-green-700">{block.blockNumber}</div>
              <div className="text-sm text-gray-400">{block.time}</div>
            </div>

            {/* Miner & Txns */}
            <div className="flex flex-col">
              <div className="text-xs text-gray-400 truncate">Miner: {block.miner} </div>
              <div className="text-xs text-gray-400">
                Txns: {block.txCount} in {block.txTime}
              </div>
            </div>

            {/* Reward */}
            <div className="flex flex-col">
              <div className="text-sm text-gray-400">Reward: {block.reward}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Section 2: Latest Transactions (static for now) */}
      <div className="border-2 border-green-700 rounded-xl p-4 w-full shadow-md">
        <div className="font-bold text-gray-500 mb-4">Latest Transactions</div>

        <LatestTransactions/>
        </div>
    </div>
  )
}

export default Section
