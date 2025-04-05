import React, { useEffect, useState } from 'react';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPageComponent/LandingPage';
import LoginRegisterForm from './components/LoginRegisterComponent/LoginRegisterForm';
import Dashboard from './components/DashboardComponent/Dashboard';
import auth from './utils/auth/auth'; 

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is logged in based on the token
  useEffect(() => {
    const token = auth.getToken();
    if (token && !auth.isTokenExpired(token)) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); 
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Routes>
            {/* Redirect to Dashboard if logged in, otherwise show login/register */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                 <LandingPage />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                 <LoginRegisterForm handleLoginSuccess={handleLoginSuccess}/>
                )
              }
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
