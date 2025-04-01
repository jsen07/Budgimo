import React, { useEffect, useState } from 'react'
import BackgroundImage from '../../assets/images/login-wallpaper.jpg';
import LoginForm from './forms/Login';
import RegisterForm from './forms/Register';

const LoginRegisterForm = ({handleLoginSuccess}) => {

  const [isLogin, setIsLogin] = useState(false);

  const handleToggle = () => {
    setIsLogin(prev => !prev);
  }
  return (
    <section id='main-container' className='w-full h-screen flex items-center justify-center'>

      <div id='wallpaper__container' className='hidden md:h-full w-1/2 bg-cover bg-no-repeat p-10 md:flex flex-col items-start justify-end' style={{ backgroundImage: `url(${BackgroundImage})` }}>
      <h1 className='font-figtree font-normal text-[80px] mb-10 text-black'>Budget Better,</h1>
      <h1 className='font-figtree font-bold text-[80px] mb-10 text-teal-600'> Live Bigger.</h1>


      </div>

        <div id='form__container' className='w-full md:h-screen md:w-1/2 font-figtree'>

        {isLogin ? (
            <LoginForm handleLoginSuccess={handleLoginSuccess} handleToggle={handleToggle} />
        ) : (
            <RegisterForm handleToggle={handleToggle} />
        )}
        
          </div>
    </section>
  )
}

export default LoginRegisterForm