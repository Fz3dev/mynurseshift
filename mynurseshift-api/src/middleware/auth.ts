import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const authMiddleware = {
  // Vérifier si l'utilisateur est authentifié
  verifyToken: (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
      ) as { userId: number; role: string };

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token invalide' });
    }
  },

  // Vérifier si l'utilisateur est un super admin
  isSuperAdmin: (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'SUPERADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    next();
  },

  // Vérifier si l'utilisateur est un admin ou un super admin
  isAdmin: (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!['ADMIN', 'SUPERADMIN'].includes(req.user?.role || '')) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    next();
  },
};
