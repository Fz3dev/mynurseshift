import { Resolver, Query, Mutation, Arg, Ctx, Authorized, InputType, Field, ID, ObjectType } from "type-graphql";
import { User, AuthPayload, UserRole, UserStatus } from "../types";
import prisma from "../../prisma";
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { EmailService } from '../../services/email.service';

@InputType()
class UpdateUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Number, { nullable: true })
  serviceId?: number;

  @Field(() => Number, { nullable: true })
  supervisorId?: number;
}

@ObjectType()
class ForgotPasswordResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@ObjectType()
class ResetPasswordResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@InputType()
class ResetPasswordInput {
  @Field()
  token: string;

  @Field()
  password: string;
}

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async users(): Promise<User[]> {
    return prisma.user.findMany({
      include: {
        service: true,
        supervisor: true,
      }
    });
  }

  @Query(() => User)
  @Authorized()
  async me(@Ctx() ctx: any): Promise<User> {
    if (!ctx.user) {
      throw new GraphQLError("Non authentifié", {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
    return prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        service: true,
        supervisor: true,
      }
    });
  }

  @Query(() => [User])
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async pendingUsers(@Ctx() ctx: any): Promise<User[]> {
    // Si c'est un ADMIN (cadre), on ne retourne que les utilisateurs en attente de son service
    if (ctx.user.role === UserRole.ADMIN) {
      const adminUser = await prisma.user.findUnique({
        where: { id: ctx.user.id },
        include: { service: true }
      });

      if (!adminUser?.service) {
        throw new GraphQLError("Cadre non rattaché à un service", {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      return prisma.user.findMany({
        where: {
          status: UserStatus.PENDING,
          serviceId: adminUser.service.id
        },
        include: {
          service: true,
          supervisor: true,
        }
      });
    }

    // Si c'est un SUPERADMIN, on retourne tous les utilisateurs en attente
    return prisma.user.findMany({
      where: {
        status: UserStatus.PENDING
      },
      include: {
        service: true,
        supervisor: true,
      }
    });
  }

  @Mutation(() => AuthPayload)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<AuthPayload> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        service: true,
        supervisor: true,
      }
    });

    if (!user) {
      throw new GraphQLError("Identifiants invalides", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw new GraphQLError("Identifiants invalides", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new GraphQLError("Le compte n'est pas actif", {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const token = sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user,
    };
  }

  @Mutation(() => User)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("role", () => UserRole, { nullable: true }) role: UserRole = UserRole.USER,
    @Arg("serviceId", () => Number, { nullable: true }) serviceId?: number,
    @Arg("supervisorId", () => Number, { nullable: true }) supervisorId?: number
  ): Promise<User> {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new GraphQLError("L'utilisateur existe déjà", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }

    const hashedPassword = await hash(password, 10);
    const status = role === UserRole.SUPERADMIN ? UserStatus.ACTIVE : UserStatus.PENDING;

    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        status,
        serviceId,
        supervisorId,
      },
      include: {
        service: true,
        supervisor: true,
      }
    });
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Arg("email") email: string
  ): Promise<ForgotPasswordResponse> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Pour des raisons de sécurité, on retourne toujours un succès
      return {
        success: true,
        message: "Si l'adresse email existe, vous recevrez un email avec les instructions.",
      };
    }

    const resetToken = sign(
      { userId: user.id, purpose: 'reset-password' },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await EmailService.sendPasswordResetEmail(email, resetToken);

    return {
      success: true,
      message: "Un email avec les instructions a été envoyé.",
    };
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Arg("input") input: ResetPasswordInput
  ): Promise<ResetPasswordResponse> {
    try {
      const decoded = verify(input.token, process.env.JWT_SECRET) as {
        userId: number;
        purpose: string;
      };

      if (decoded.purpose !== 'reset-password') {
        throw new Error('Token invalide');
      }

      const hashedPassword = await hash(input.password, 10);

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
      });

      return {
        success: true,
        message: "Votre mot de passe a été réinitialisé avec succès.",
      };
    } catch (error) {
      throw new GraphQLError("Le lien de réinitialisation est invalide ou a expiré", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }
  }

  @Mutation(() => User)
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async approveUser(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: any
  ): Promise<User> {
    const userToApprove = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { service: true }
    });

    if (!userToApprove) {
      throw new GraphQLError("Utilisateur non trouvé", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }

    // Si c'est un ADMIN (cadre), vérifier qu'il approuve un utilisateur de son service
    if (ctx.user.role === UserRole.ADMIN) {
      const adminUser = await prisma.user.findUnique({
        where: { id: ctx.user.id },
        include: { service: true }
      });

      if (!adminUser?.service || userToApprove.serviceId !== adminUser.service.id) {
        throw new GraphQLError("Non autorisé à approuver cet utilisateur", {
          extensions: { code: 'FORBIDDEN' }
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { status: UserStatus.ACTIVE },
      include: {
        service: true,
        supervisor: true,
      }
    });

    // Envoyer l'email de validation
    await EmailService.sendAccountValidationEmail(
      updatedUser,
      ctx.user.role === UserRole.SUPERADMIN ? { role: UserRole.SUPERADMIN } : ctx.user
    );

    return updatedUser;
  }

  @Mutation(() => User)
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async rejectUser(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: any
  ): Promise<User> {
    const userToReject = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { service: true }
    });

    if (!userToReject) {
      throw new GraphQLError("Utilisateur non trouvé", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }

    // Si c'est un ADMIN (cadre), vérifier qu'il rejette un utilisateur de son service
    if (ctx.user.role === UserRole.ADMIN) {
      const adminUser = await prisma.user.findUnique({
        where: { id: ctx.user.id },
        include: { service: true }
      });

      if (!adminUser?.service || userToReject.serviceId !== adminUser.service.id) {
        throw new GraphQLError("Non autorisé à rejeter cet utilisateur", {
          extensions: { code: 'FORBIDDEN' }
        });
      }
    }

    return prisma.user.update({
      where: { id: parseInt(id) },
      data: { status: UserStatus.INACTIVE },
      include: {
        service: true,
        supervisor: true,
      }
    });
  }

  @Mutation(() => User)
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async updateUser(
    @Arg("id", () => ID) id: string,
    @Arg("input") input: UpdateUserInput,
    @Ctx() ctx: any
  ): Promise<User> {
    const userToUpdate = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { service: true }
    });

    if (!userToUpdate) {
      throw new GraphQLError("Utilisateur non trouvé", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }

    // Si c'est un ADMIN (cadre), vérifier qu'il modifie un utilisateur de son service
    if (ctx.user.role === UserRole.ADMIN) {
      const adminUser = await prisma.user.findUnique({
        where: { id: ctx.user.id },
        include: { service: true }
      });

      if (!adminUser?.service || userToUpdate.serviceId !== adminUser.service.id) {
        throw new GraphQLError("Non autorisé à modifier cet utilisateur", {
          extensions: { code: 'FORBIDDEN' }
        });
      }
    }

    return prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        role: input.role,
        serviceId: input.serviceId,
        supervisorId: input.supervisorId,
      },
      include: {
        service: true,
        supervisor: true,
      }
    });
  }
}
