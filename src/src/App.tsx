/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Documents } from './pages/Documents';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Settings from './pages/Settings';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'documents':
        return <Documents />;
      case 'customers':
        return <Customers />;
      case 'products':
        return <Products />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
