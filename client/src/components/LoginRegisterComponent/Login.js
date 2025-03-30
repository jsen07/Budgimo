import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { loginMutation } from '../../utils/mutations/mutations';
import auth from '../../utils/auth/auth'


const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
  
    const [login, { loading, error }] = useMutation(loginMutation);
  
    const handleChange = (e) => {
        setEmail(e.target.value);
      };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Attempting login with:", { email, password });
      try {
        const { data } = await login({
          variables: { email, password },
        });
        console.log("Login response:", data); // Debugging line
        auth.login(data.login.token);
        onLoginSuccess();
      } catch (err) {
        console.error('Login:', err);
        setMessage("Login failed. Please check your credentials.");
      }
    };
  
  
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <button type="submit" disabled={loading}>
          Login
        </button>
        {error && <p>Error: {error.message}</p>}

        {message && <p style={{ color: error ? "red" : "green" }}>{message}</p>}
      </form>
    );
};


export default Login