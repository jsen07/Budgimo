import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { loginMutation } from '../../../utils/mutations/mutations';
import auth from '../../../utils/auth/auth';
import VpnKeyIcon from '@mui/icons-material/VpnKey';


const Login = ({ handleLoginSuccess, handleToggle }) => {
  const [email, setEmail] = useState("");
  
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const [login, { loading }] = useMutation(loginMutation);
  
    const handleChange = (e) => {
        setEmail(e.target.value);
      };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };

    const validateForm = () => {
      setError("");
  
      if (!email.trim()) {
        setError("Email is required");
        return false;
      }
  
      if (!password.trim()) {
        setError("Password is required");
        return false;
      }
  
      return true;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const isValid = validateForm();
      if (!isValid) {
        return; 
      }
      
      try {
        const { data } = await login({
          variables: { email, password },
        });
        auth.login(data.login.token);
        handleLoginSuccess();
      } catch (err) {
        console.error('Login:', err);
        setError("Login failed. Please check your credentials.");
      }
    };
  
  
  
    return (
<div className='w-full h-screen flex justify-start items-center flex-col sm:pr-4 md:h-3/4 md:items-start md:pl-4 md:py-10 lg:pl-10 lg:pr-5 2xl:w-2/3'>
  <h1 className='font-hero font-semibold text-[50px] tracking-wider mt-10 sm:pl-4 md:mt-2 md:mb-2 mb-5 text-teal-600'> Budgimo </h1>
  <h1 className='font-figtreen font-semibold text-[34px] tracking-wide my-5 sm:pl-4'> Login </h1>
  <h2 className=' text-center px-4 font-figtreen font-normal text-sm tracking-wider mb-10 sm:pl-4 sm:px-0 md:text-start'> Log into your account and start managing your expenses! </h2>

    <form onSubmit={handleSubmit} className='border-box flex flex-col w-full h-auto sm:w-3/4 md:w-full md:items-end'>

    <div id='row-2'className='flex flex-col w-full p-2 mb-2'>

      <div className='w-full p-1 mb-2 relative'>
      <label for="email" className='absolute top-[0px] left-[10px] bg-white px-2 text-xs'> E-mail</label>
        <input
         className='w-full mt-1 p-2 text-sm border-2 border-black placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-b-4 focus:border-teal-500 transition'
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
            </div>
      <div className='w-full p-1 mb-2 relative'>
<label for="password" className='absolute top-[0px] left-[10px] bg-white px-2 text-xs'> Password </label>
        <input
          className='w-full mt-1 p-2 text-sm border-2 border-black placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-b-4 focus:border-teal-500 transition'
          type="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
        </div>

        <div className='flex flex-col items-center justify-center md:w-full  md:pl-4 md:flex-row gap-2 sm:flex-row'>
        {error && <p className='text-red-600 md:self-center'>{error}</p>}
        <button type="submit" disabled={loading} className='border w-full px-3 py-2 rounded-md bg-teal-400 text-black flex items-center justify-center ml-auto hover:scale-95 transition md:max-w-[150px]'>
        <VpnKeyIcon className='mr-1'/>
          Login
        </button>
        </div>

        </div>
      </form>
          <div className='flex flex-row w-inherit items-center justify-center h-full md:w-full md:mt-10 md:mt-0 md:h-auto'>
          <p className='mr-1 text-sm'> Don't have an account?</p>
          <p onClick={()=> handleToggle()} className='underline cursor-pointer text-sm hover:scale-95 transition hover:no-underline'> Register</p>
        </div>
    </div>
    );
};


export default Login