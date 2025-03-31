import React, { useState, useEffect } from 'react';
import BackgroundImage from '../../assets/images/budgimo-bg.jpg';
import JulieDaviesImage from '../../assets/images/Julie_Davies_img.jpeg'
import EkeleAgbaniImage from '../../assets/images/Ekele_Agbani.jpeg'
import MuhammadImage from '../../assets/images/Muhammad.jpeg'
import MeiLungImage from '../../assets/images/Mei_Leung.jpeg'
import { useNavigate } from "react-router-dom";
import MobileMenu from './subcomponents/MobileMenu';

const LandingPage = () => {

  const navigate = useNavigate();

  const [menuActive, setMenuActive] = useState(false);
  const [closing, setClosing] = useState(false);
  const people_reviews = [
    {
      name: "Julie Davis",
      img: JulieDaviesImage,
      review:
      "After buying our first home, my partner and I fell into serious credit card debt trying to furnish it and handle unexpected repairs. I never budgeted before, but after a friend recommended Budgimo, I gave it a shot. One year later, we're debt-free, finally saving, and I'm now budgeting for my wedding and dream honeymoon. Budgimo changed my life."
    },
    {
      name: "Ekele Agbani",
      img: EkeleAgbaniImage,
      review:
      "Since using Budgimo, I paid off 3 credit cards and built an emergency fund. It's a game-changer."
    },
    {
      name: "Muhammad",
      img : MuhammadImage,
      review:
      "Budgimo helped me actually visualise where my money was going. For the first time, I could clearly track my income and expenses, which makes me feel more in control. I’ve become way more mindful with spending and even started putting money aside to invest. It’s been a real breakthrough."
    },
    {
      name: "Mei Leung",
      img: MeiLungImage,
      review:
      "After being made redundant, I knew I had to get smarter with my savings while job hunting. Budgimo helped me manage my money with confidence. I built better spending habits, stayed anxiety-free during unemployment, and even grew my savings. I landed a new job and felt financially stronger than ever."
    }
  ]
  const FAQ_section=[
    {
      question: "What is Budgimo?",
      answer: "Budgimo is a personal budgeting app that helps you track spending, set savings goals, and stay on top of your finances with ease."
    },
    {
      question: "Is Budgimo free to use?",
      answer: "Yes! Budgimo offers a free version with powerful tools. We also have a premium version with advanced analytics and personalized insights."
    },
    {
      question: "How do I track my expenses?",
      answer: "You need to manually add your expenses on the sheet"
    },
    {
      question: "Is my financial data safe?",
      answer: "Absolutely. Your privacy and security are our top priorities."
    },
    {
      question: "Can I set financial goals in the app?",
      answer: "Definitely. Budgimo makes it easy to create goals like saving for a vacation, paying off debt, or building an emergency fund."
    },
    {
      question: "Is Budgimo available on Android and iOS?",
      answer: "Yes, Budgimo is available on both Android and iOS so you can manage your money anytime, anywhere."
    },
    {
      question: "How do I get started?",
      answer: "Just download the app, create an account, and follow the setup steps. You'll be budgeting like a pro in no time."
    }
  ]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        // Close the menu when screen size is >= 640px
        setMenuActive(false);
      }
    };

    window.addEventListener('resize', handleResize);

  }, []);

  const toggleMobileMenu = () => {
    if (menuActive) {
      setClosing(true);

      setTimeout(() => {
        setMenuActive(false);
        setClosing(false);
      }, 500); 
    } else {
      setMenuActive(true);
    }
  };
  return (
    <div className='w-full h-screen text-white'>

<nav className='w-full h-16 top-0 fixed z-10 flex justify-between items-center px-4 bg-amber-500 text-black'>
  {/* Mobile Menu Button */}

  <h1 className='text-xl ml-4 text-teal-600 font-hero sm:text-2xl'> Budgimo </h1>
  <button className="flex items-center p-3 sm:hidden" onClick={()=> toggleMobileMenu()} aria-label="Open menu">
    <svg className="text-teal-600 block h-8 w-8 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
    </svg>
  </button>

  

  {/* Navigation Links */}
  <div className='hidden sm:flex flex-row space-x-6 mr-6 w-full justify-end text-md text-white'>
    <a className='scroll-smooth cursor-pointer font-medium hover:text-teal-600 transition' href="#about">About</a>
    <a className='scroll-smooth cursor-pointer font-medium hover:text-teal-600 transition' href="#services">Services</a>
    <a className='scroll-smooth cursor-pointer font-medium hover:text-teal-600 transition' href="#faq">FAQ</a>
    <a className='scroll-smooth cursor-pointer font-medium hover:text-teal-600 transition' href="#contact">Contact</a>
    <button className='scroll-smooth cursor-pointer font-medium hover:text-teal-600 transition' onClick={()=> navigate('/login')}>Login</button>
</div>
</nav>

{menuActive && ( 
  <div className={`top-0 fixed left-0 bg-stone-100 z-50 w-full h-screen ${
    closing ? "animate-slide-out" : "animate-slide-in"
  }`}>
    <MobileMenu toggleMobileMenu={toggleMobileMenu}/>
    </div>)}


{/* Main container  */}
      <section id="#" className='relative w-full h-screen bg-cover bg-[right_15%_top] bg-no-repeat flex flex-col items-center justify-center sm:bg-[right_10%_top] lg:bg-center lg:pl-20'
      style={{ backgroundImage: `url(${BackgroundImage})` }}>

{/* Hero Text container */}
        <div className='w-full h-[35%] flex flex-col items-center justify-between animate-fade1 lg:flex-row lg:items-start lg:justify-between lg:m-0 lg:h-[350px]'>

          <div className='w-full flex flex-col items-center justify-center lg:justify-start lg:flex-col lg:items-start'>
            {/* <h2 className=' text-lg text-center text-white italic font-normal lg:text-start lg:hidden'> Control yourself with </h2> */}
            <h1 className='text-7xl sm:text-8xl text-teal-600 font-hero underline underline-offset-[20%]' style={{ textShadow: '4px 4px 4px rgba(0, 0, 0, 0.5)' }}> Budgimo </h1>
       

          <div className='animate-fade2 lg:mt-10 lg:my-4 lg:w-full lg:w-[700px]'>
          {/* <h2 className='text-xl font-sans font-thin text-indigo-950 mb-10 text-center'>Join thousands on the journey to financial freedom.</h2> */}

          <h1 className='text-medium font-sans font-thin text-black mb-10 text-center mx-4 mt-10 md:mb-1 md:text-start lg:m-0'>
          Managing your finances just got easier with Budgimo! Whether you're saving for a special goal, tracking monthly expenses, or simply looking to take control of your financial future, Budgimo is here to help.
          </h1>
          <h1 className='hidden text-medium font-sans font-thin md:flex text-black mx-4 lg:m-0'> With intuitive budgeting tools, real-time expense tracking, and insightful analytics, you can make smarter financial decisions effortlessly. Stay on top of your spending, set achievable savings goals, and gain the confidence to manage your money like a pro—all in one easy-to-use platform.</h1>

          </div>
          </div>

          {/* <div className='hidden lg:flex flex-col w-full h-[100%] lg:text-center items-center justify-center mx-[100px]'>
            <h1 className='min-w-[500px] text-4xl text-teal-600 font-hero'> Join thousands on the journey to financial freedom </h1>
          </div> */}
        </div>

{/* hero button */}
        <div id='hero' className='w-full flex flex-row items-center justify-center lg:items-start lg:justify-start'>
          {/* <button onClick={() => setIsLoginForm(false)} disabled={!isLoginForm} className="mx-2 w-24 p-3 rounded-md bg-teal-600">Register</button>
          <button onClick={() => setIsLoginForm(true)} disabled={isLoginForm} className="mx-2  w-24 p-3 rounded-md bg-teal-500">Sign in</button> */}

<div className="relative px-6 py-3 font-bold text-white group mt-10 cursor-pointer">
    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-teal-500 group-hover:translate-x-0 group-hover:translate-y-0"></span>
    <span className="absolute inset-0 w-full h-full border-4 border-black"></span>
    <button onClick={()=> navigate('/login')} className="relative">Get started</button>
</div>
{/* 
<div className='w-[450px] h-[100px] border-2 border-black'></div> */}
        </div>



           </section>

           <section id="about"className='h-auto bg-indigo-50 p-6 flex flex-col items-center'>
           <h1 className='text-2xl text-center pt-6 text-teal-600 font-hero mb-8'> Join thousands on the journey to financial freedom </h1>
           <div className="w-full max-q-md space-y-8"></div>
           {people_reviews.map(({name, img, review})=> (
          <div
            key={name}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center"
          >
            <img
              src={img}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-2 border-teal-500 mb-2 object-center"
            />
            <p className="text-sm italic text-gray-600 mb-1">“{review}”</p>
            <p className="text-teal-700 font-semibold">— {name}</p>
          </div>))}
           </section>

           <section id="services"className='text-black h-screen bg-indigo-300'>
            <h1 className='bg-oklch(0.852 0.199 91.936)'> Services </h1>
           </section>

           <section id="faq"className='text-black h-auto bg-indigo-400 p-6'>
           <h1 className="text-3xl font-hero text-teal-100 text-center mb-6">FAQ</h1>
           <div className="space-y-4 max-w-md mx-auto"></div>
           {FAQ_section.map((faq, index)=>(
          <details key={index} className="bg-white rounded-lg p-4 shadow-md my-3">
            <summary className="cursor-pointer font-semibold text-teal-700">{faq.question}</summary>
            <p className="mt-2 text-sm text-gray-700">{faq.answer}</p>
          </details>
        ))}
           </section>

           <section id="contact"className='text-black h-screen bg-indigo-500'>
            <h1 className='bg-oklch(0.852 0.199 91.936)'> Contact </h1>
           </section>
      </div>
  )
}

export default LandingPage