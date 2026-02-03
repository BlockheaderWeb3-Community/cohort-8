import React from 'react'
import { Searchbar } from './searchbar'
import { FaHome } from "react-icons/fa";



export const Navbar = () => {
  return (
    <div className='flex justify-between items-center p-5 '>
    <div className="mx-3">
  <h1 className="text-2xl font-extrabold tracking-tight text-green-500 drop-shadow-sm">
    Block Explorer
  </h1>
</div>

   <div><Searchbar/></div> 
   <div><FaHome className="w-6 h-6 text-green-500"/></div> 
   </div>
  )
}
