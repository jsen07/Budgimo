import React, { useEffect } from 'react';
import auth from '../utils/auth/auth'


const Dashboard = () => {

  useEffect(() => {
    const data = auth.getProfile();
    console.log(data)
  },[])

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>

      <div className="flex justify-center items-center bg-blue-500">
      <h1 className="text-4xl font-bold text-white">Hello, Tailwind!</h1>
    </div>
      {/* Dashboard content here */}
      <button className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      onClick={()=> auth.logout()}> logout</button>
    </div>
  );
};

export default Dashboard;