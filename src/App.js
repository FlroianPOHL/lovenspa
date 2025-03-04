import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import fr from '@shopify/polaris/locales/fr.json';
import '@shopify/polaris/dist/styles.css';

import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ListingEditor from './components/listings/ListingEditor'; // Ajoutez cette ligne
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AppProvider i18n={fr}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            {/* Ajoutez cette route */}
            <Route 
              path="/listings/new" 
              element={
                <PrivateRoute>
                  <ListingEditor />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;