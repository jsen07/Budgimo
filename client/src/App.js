import React, { useEffect, useState } from "react";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPageComponent/LandingPage";
import LoginRegisterForm from "./components/LoginRegisterComponent/LoginRegisterForm";
import Dashboard from "./components/DashboardComponent/Dashboard";
import Transactions from "./components/TransactionComponent/Transactions";
import EditTransaction from "./components/EditTransactionComponent/EditTransaction";
import Schedule from "./components/ScheduleComponent/Schedule";
import auth from "./utils/auth/auth";
import FsLoading from "./components/Loaders/FsLoading";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: `/graphql`,
  cache: new InMemoryCache(),
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (window.location.pathname !== window.location.pathname.toLowerCase()) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname.toLowerCase()
      );
    }
  }, []);

  useEffect(() => {
    const token = auth.getToken();
    if (token && !auth.isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <FsLoading />;
  }

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
                isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <LoginRegisterForm handleLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/transactions"
              element={isAuthenticated ? <Transactions /> : <Navigate to="/" />}
            />

            <Route
              path="/transactions/edit/:transactionId"
              element={
                isAuthenticated ? <EditTransaction /> : <Navigate to="/" />
              }
            />

            <Route
              path="/schedule"
              element={isAuthenticated ? <Schedule /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
