'use client'

import { useGasService } from '@/lib/useEtherscanService'
import { Flame, AlertCircle, CheckCircle } from 'lucide-react'

export default function GasTracker() {
  const { useGasOracle, useGasEstimate } = useGasService()
  
  const { 
    data: gasData, 
    isLoading, 
    error 
  } = useGasOracle()
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
        ))}
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <span>Gas data temporarily unavailable</span>
        </div>
      </div>
    )
  }
  
  const gasOracle = gasData?.result
  
//   const gasLevels = [
//     {
//       name: 'Slow',
//       gwei: gasOracle?.SafeGasPrice || '0',
//       time: '~10 min',
//       color: 'bg-green-100 text-green-800',
//       icon: CheckCircle,