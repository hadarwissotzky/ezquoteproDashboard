import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout';
import Dashboard from '../pages/dashboard';
import Analytics from '../pages/analytics';
import Geographic from '../pages/geograpgic';
import Usage from '../pages/usage';
import Documents from '../pages/documents';
import CustomerSuccess from '../pages/customSuccess';
import { DashboardAuth } from '../entities/dashboardAuth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authData = localStorage.getItem('ezquote_auth');
    if (authData) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <DashboardAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <Layout currentPageName="Dashboard">
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/analytics"
          element={
            <Layout currentPageName="Analytics">
              <Analytics />
            </Layout>
          }
        />
        <Route
          path="/geographic"
          element={
            <Layout currentPageName="Geographic">
              <Geographic />
            </Layout>
          }
        />
        <Route
          path="/usage"
          element={
            <Layout currentPageName="Usage">
              <Usage />
            </Layout>
          }
        />
        <Route
          path="/documents"
          element={
            <Layout currentPageName="Documents">
              <Documents />
            </Layout>
          }
        />
        <Route
          path="/customer-success"
          element={
            <Layout currentPageName="CustomerSuccess">
              <CustomerSuccess />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;