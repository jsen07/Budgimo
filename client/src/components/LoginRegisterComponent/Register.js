import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { registerMutation } from '../../utils/queries/mutations';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });

  const [password, setPassword] = useState("");

  const [register, { loading, error }] = useMutation(registerMutation);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);  // Handle password input separately
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({
        variables: { userData: formData, password: password },
      });
      console.log('User registered:', data);
    } catch (err) {
      console.error('Error registering user:', err);
      console.log(formData)
    }
  };



  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
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
        Register
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default RegisterForm;