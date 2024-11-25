import { AuthBindings } from "@refinedev/core";

const API_URL = "http://localhost:3000/api";

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    // La mutation est maintenant gérée directement dans le composant Login
    // Nous stockons juste le résultat ici
    return {
      success: true,
      redirectTo: "/",
    };
  },

  logout: async () => {
    try {
      localStorage.removeItem("auth");
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
        error: new Error("Erreur lors de la déconnexion"),
      };
    }
  },

  check: async () => {
    try {
      const auth = localStorage.getItem("auth");
      if (!auth) {
        return {
          authenticated: false,
          redirectTo: "/login",
          error: new Error("Non authentifié"),
        };
      }

      const { token } = JSON.parse(auth);
      if (!token) {
        return {
          authenticated: false,
          redirectTo: "/login",
          error: new Error("Token invalide"),
        };
      }

      return {
        authenticated: true,
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
        error: new Error("Erreur lors de la vérification de l'authentification"),
      };
    }
  },

  getPermissions: async () => {
    try {
      const auth = localStorage.getItem("auth");
      if (!auth) {
        return null;
      }

      const { user } = JSON.parse(auth);
      return user?.role || null;
    } catch (error) {
      console.error("Erreur lors de la récupération des permissions:", error);
      return null;
    }
  },

  getIdentity: async () => {
    try {
      const auth = localStorage.getItem("auth");
      if (!auth) {
        return null;
      }

      const { user } = JSON.parse(auth);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération de l'identité:", error);
      return null;
    }
  },

  onError: async (error) => {
    console.error("Erreur d'authentification:", error);
    
    if (!error) {
      return {};
    }

    const status = error.statusCode;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return {
        logout: true,
        redirectTo: "/login",
        error: new Error("Non autorisé"),
      };
    }

    // Gérer les autres types d'erreurs
    return {
      error: new Error(error.message || "Une erreur est survenue"),
    };
  },
};
