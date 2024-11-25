import { AuthBindings } from "@refinedev/core";
import { notification } from "antd";

export const authProvider: AuthBindings = {
  login: async ({ token, user }) => {
    if (token && user) {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token,
          user,
        })
      );
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid credentials",
      },
    };
  },

  logout: async () => {
    localStorage.removeItem("auth");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { user } = JSON.parse(auth);
      if (user.role !== "SUPER_ADMIN") {
        notification.error({
          message: "Unauthorized",
          description: "You need super admin privileges to access this area",
        });
        return {
          authenticated: false,
          redirectTo: "/login",
          error: {
            message: "You need super admin privileges to access this area",
            name: "Unauthorized",
          },
        };
      }
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { user } = JSON.parse(auth);
      return user.role;
    }
    return null;
  },

  getIdentity: async () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { user } = JSON.parse(auth);
      return user;
    }
    return null;
  },

  onError: async (error) => {
    if (error.statusCode === 401 || error.statusCode === 403) {
      localStorage.removeItem("auth");
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return {};
  },
};
