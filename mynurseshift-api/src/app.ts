import "reflect-metadata";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { verify } from "jsonwebtoken";
import cors from "cors";
import dotenv from 'dotenv';
import { UserResolver } from "./schema/resolvers/user.resolver";
import { PoleResolver } from "./schema/resolvers/pole.resolver";
import { ServiceResolver } from "./schema/resolvers/service.resolver";
import { DashboardResolver } from "./schema/resolvers/dashboard.resolver";
import userRoutes from './routes/userRoutes';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

const app = express();

// Middleware de base
app.use(cors());
app.use(express.json());

// Routes REST
app.use('/api/users', userRoutes);

const getUser = async (token: string) => {
  try {
    if (token) {
      const user = verify(token, process.env.JWT_SECRET as string);
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

interface MyContext {
  user: any;
  token?: string;
}

const startApolloServer = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, PoleResolver, ServiceResolver, DashboardResolver],
    authChecker: ({ context: { user } }, roles) => {
      if (!user) {
        return false;
      }
      if (!roles.length) {
        return true;
      }
      return roles.includes(user.role);
    },
  });

  const server = new ApolloServer<MyContext>({
    schema,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        extensions: {
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        },
      };
    },
  });

  await server.start();

  // Appliquer le middleware GraphQL
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const user = token ? await getUser(token) : null;
        return { user, token };
      },
    })
  );
};

// Démarrer le serveur Apollo
startApolloServer().catch(error => {
  console.error('Failed to start Apollo Server:', error);
  process.exit(1);
});

// Middleware de gestion des erreurs
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Une erreur est survenue !',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 3000;

// Démarrer le serveur Express
app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});

export default app;
