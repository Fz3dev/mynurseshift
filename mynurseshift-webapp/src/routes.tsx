import { createBrowserRouter } from "react-router-dom";
import { Login } from "@/pages/auth/login";
import { Register } from "@/pages/auth/register";
import { ForgotPassword } from "@/pages/auth/forgot-password";
import { ResetPassword } from "@/pages/auth/reset-password";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <div>Dashboard</div>,
          },
        ],
      },
    ],
  },
]);

export default router;
