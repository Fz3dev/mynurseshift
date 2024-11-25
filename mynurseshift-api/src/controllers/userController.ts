import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const userController = {
  // Récupérer tous les utilisateurs
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          department: true,
          position: true,
          workingHours: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          department: true,
          position: true,
          workingHours: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
  },

  // Créer un nouvel utilisateur
  createUser: async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone, role, department, position, workingHours } = req.body;
      
      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          role: role || 'USER',
          status: 'PENDING',
          department,
          position,
          workingHours,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          department: true,
          position: true,
          workingHours: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
  },

  // Approuver un utilisateur
  approveUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { status: 'ACTIVE' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          department: true,
          position: true,
          workingHours: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'approbation de l\'utilisateur' });
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, phone, role, status, department, position, workingHours } = req.body;

      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          firstName,
          lastName,
          phone,
          role,
          status,
          department,
          position,
          workingHours,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          department: true,
          position: true,
          workingHours: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id: Number(id) } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  },

  // Connexion utilisateur
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      // Vérifier si l'utilisateur est actif
      if (user.status !== 'ACTIVE') {
        return res.status(401).json({ error: 'Votre compte n\'est pas encore activé' });
      }

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      // Créer le token JWT
      const token = jwt.sign(
        { 
          userId: user.id,
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  },
};
