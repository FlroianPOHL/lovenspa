import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Frame, Loading } from '@shopify/polaris';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Frame>
        <Loading />
      </Frame>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}