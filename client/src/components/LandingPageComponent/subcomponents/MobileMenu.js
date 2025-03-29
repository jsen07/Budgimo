import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';
import TaskRoundedIcon from '@mui/icons-material/TaskRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import ContactPageRoundedIcon from '@mui/icons-material/ContactPageRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';

const MobileMenu = ({toggleMobileMenu}) => {

      const navigate = useNavigate();
      const [fontSize, setFontSize] = useState('30px');

  return (
    <div className=' fixed w-full h-screen flex flex-col'>
        <div className='w-full h-16 flex justify-between items-center px-2 bg-amber-500'>
        <h1 className='text-xl ml-4 text-teal-600 font-hero'> Budgimo </h1>

        {/* Close Button */}
          <button className="flex items-center p-4 sm:hidden hover:scale-90 transition" onClick={()=> toggleMobileMenu()} aria-label="Open menu">
          <svg className="text-teal-600 block h-8 w-8 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 3L17 17M17 3L3 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
</svg>

  </button>
  </div>

<div className='w-full h-[100%] flex flex-col items-start space-y-3 mt-10 text-black'>

<h1 className='ml-2 mt-4 text-[10px] text-zinc-600 font-bold'> GENERAL INFORMATION </h1>
    <a className=' flex text-md h-[50px] w-full p-4 items-center scroll-smooth cursor-pointer font-medium  hover:bg-amber-400 transition' href="#about" onClick={()=> toggleMobileMenu()}><InfoIcon className='mr-8 text-teal-600' style={{ fontSize: fontSize }}/>About</a>


    <a className=' flex text-md h-[50px] w-full border-black p-4 items-center scroll-smooth cursor-pointer font-medium  hover:bg-amber-400 transition' href="#services" onClick={()=> toggleMobileMenu()}><TaskRoundedIcon className='mr-8 text-teal-600' style={{ fontSize: fontSize }}/>Services</a>

    <a className=' flex text-md h-[50px] w-full p-4 items-center scroll-smooth cursor-pointer font-medium  hover:bg-amber-400 transition' href="#faq" onClick={()=> toggleMobileMenu()}><HelpRoundedIcon className='mr-8 text-teal-600' style={{ fontSize: fontSize }}/>FAQ</a>

  <h1 className='ml-2 mt-4 text-[10px] text-zinc-600 font-bold'> CONTACT US </h1>
    <a className=' flex text-md h-[50px] w-full p-4 items-center scroll-smooth cursor-pointer font-medium  hover:bg-amber-400 transition' href="#contact" onClick={()=> toggleMobileMenu()}><ContactPageRoundedIcon className='mr-8 text-teal-600' style={{ fontSize: fontSize }}/>Feedback</a>

  <h1 className='ml-2 mt-4 text-[10px] text-zinc-600 font-bold'> ACCESS </h1>
    <button className=' flex text-md h-[50px] w-full p-4 items-center scroll-smooth cursor-pointer font-medium  hover:bg-amber-400 transition' onClick={()=> navigate('/login')}><LoginRoundedIcon className='mr-8 text-teal-600' style={{ fontSize: fontSize }}/>Login</button>
    
    </div>

    <div className='text-black flex justify-center mb-12 flex-col items-center'>
      
      
      <a href="#"><ArrowCircleUpRoundedIcon className='hover:cursor-pointer text-teal-600' style={{ fontSize: fontSize }} onClick={()=> toggleMobileMenu()} /></a>
      <h1 className='text-sm'> Back to top 
      </h1>
    </div>

    </div>
  )
}

export default MobileMenu