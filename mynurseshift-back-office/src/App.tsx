import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import frFR from 'antd/locale/fr_FR';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo-client';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './pages/auth/login';
import { Dashboard } from './pages/dashboard';
import { Layout } from './components/layout';
import { ServiceCreate } from './pages/services/create';
import { ServicesListPage } from './pages/services/list';
import { ServiceEdit } from './pages/services/edit';
import { ValidationsListPage } from './pages/validations/list';
import { ValidationShowPage } from './pages/validations/show';
import { UserList } from './pages/users/list';
import { UserEdit } from './pages/users/edit';
import { UserCreate } from './pages/users/create';
import { PolesListPage } from './pages/poles/list';
import { PoleCreate } from './pages/poles/create';

const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
  },
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={frFR}
      theme={theme}
    >
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            
            {/* Routes protégées */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Services */}
                <Route path="/services">
                  <Route index element={<ServicesListPage />} />
                  <Route path="create" element={<ServiceCreate />} />
                  <Route path="edit/:id" element={<ServiceEdit />} />
                </Route>
                
                {/* Users */}
                <Route path="/users">
                  <Route index element={<UserList />} />
                  <Route path="new" element={<UserCreate />} />
                  <Route path=":id/edit" element={<UserEdit />} />
                </Route>

                {/* Poles */}
                <Route path="/poles">
                  <Route index element={<PolesListPage />} />
                  <Route path="create" element={<PoleCreate />} />
                </Route>

                {/* Validations */}
                <Route path="/validations">
                  <Route index element={<ValidationsListPage />} />
                  <Route path=":id" element={<ValidationShowPage />} />
                </Route>

                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>

            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </ConfigProvider>
  );
};

export default App;
