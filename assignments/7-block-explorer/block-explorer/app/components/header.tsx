import React from 'react'
import { Navbar } from './Navbar';

export const Header = () => {
  return (
    <div>
       <div className='flex  w-full  justify-evenly items-center text-gray-400 my-1 font-sans border-b-2 border-green-700 pb-3 shadow-lg'>
            <div className='
            text-xs  mx-3 border-2
             border-green-500 rounded-lg
             shadow-cyan-300 p-5'>
                ETH Price: $20000
            </div>

              <div className='
            text-xs  mx-3 border-2
             border-green-500 rounded-lg
             shadow-cyan-300 p-5'>
                Market Cap: $20000
            </div>

             <div className='
            text-xs  mx-3 border-2
             border-green-500 rounded-lg
             shadow-cyan-300 p-5'>
                Transactions: $20000
            </div>
       </div>
      
  <div>
    <Navbar/>
    </div>      
        
        </div>
  )
};
