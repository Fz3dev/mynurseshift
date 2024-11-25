import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterStepForm } from '../components/auth/RegisterStepForm';
import { RegistrationPending } from '../components/auth/RegistrationPending';
import { AuthLayout } from '../components/auth/AuthLayout';
import { NotFound } from '../components/errors/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <RegisterStepForm />
      </AuthLayout>
    ),
  },
  {
    path: '/registration-pending',
    element: (
      <AuthLayout>
        <RegistrationPending />
      </AuthLayout>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);