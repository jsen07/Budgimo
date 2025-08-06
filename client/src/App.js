import React, { useEffect, useState } from "react";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavigationLinks from "./components/NavigationComponent/NavigationLinks";
import MobileNavWrapper from "./components/NavigationComponent/MobileNavWrapper";
import LandingPage from "./components/LandingPageComponent/LandingPage";
import LoginRegisterForm from "./components/LoginRegisterComponent/LoginRegisterForm";
import Dashboard from "./components/DashboardComponent/Dashboard";
import Transactions from "./components/TransactionComponent/Transactions";
import EditTransaction from "./components/EditTransactionComponent/EditTransaction";
import Schedule from "./components/ScheduleComponent/Schedule";
import Charts from "./components/AnalyticsComponent/Charts";
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

    if (!token || auth.isTokenExpired(token)) {
      localStorage.removeItem("monthSlice");
      localStorage.removeItem("expenseSlice");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // useEffect(() => {
  //   const token = auth.getToken();
  //   if (token && !auth.isTokenExpired(token)) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false);
  //   }
  // }, []);

  if (isAuthenticated === null) {
    return <FsLoading />;
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex flex-col w-full 2xl:flex-row">
          {/* <div class="fixed top-0 left-0 z-50 bg-black text-white text-base px-10 py-1 rounded-br">
            <div class="block sm:hidden">XS</div>
            <div class="hidden sm:block md:hidden">SM</div>
            <div class="hidden md:block lg:hidden">MD</div>
            <div class="hidden lg:block xl:hidden">LG</div>
            <div class="hidden xl:block 2xl:hidden">XL</div>
            <div class="hidden 2xl:block">2XL</div>
          </div> */}
          {isAuthenticated && (
            <div className="hidden 2xl:flex bg-neutral-800">
              <NavigationLinks />
            </div>
          )}

          <Routes>
            {/* <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
              }
            /> */}
            <Route
              path="/"
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

            <Route
              path="/analytics"
              element={isAuthenticated ? <Charts /> : <Navigate to="/" />}
            />
          </Routes>
          <MobileNavWrapper />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
