import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin, Space, Typography } from 'antd';
import { useAuth } from '../../hooks/useAuth';

const { Text } = Typography;

export const ProtectedRoute: React.FC = () => {
  const { isLoading, checkAuth } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f0f2f5'
      }}>
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Text>Chargement...</Text>
        </Space>
      </div>
    );
  }

  const isAuthenticated = checkAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
