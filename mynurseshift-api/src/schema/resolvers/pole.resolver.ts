import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import { Pole, UserRole } from "../types";
import prisma from "../../prisma";
import { GraphQLError } from "graphql";

@Resolver(Pole)
export class PoleResolver {
  @Query(() => [Pole])
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async poles(): Promise<Pole[]> {
    return prisma.pole.findMany({
      include: {
        services: true,
      },
    });
  }

  @Query(() => Pole)
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async pole(@Arg("id") id: string): Promise<Pole> {
    const pole = await prisma.pole.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });

    if (!pole) {
      throw new GraphQLError("Pôle non trouvé", {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return pole;
  }

  @Mutation(() => Pole)
  @Authorized([UserRole.SUPERADMIN])
  async createPole(
    @Arg("name") name: string,
    @Arg("code") code: string,
    @Arg("description") description: string
  ): Promise<Pole> {
    const existingPole = await prisma.pole.findUnique({
      where: { code }
    });

    if (existingPole) {
      throw new GraphQLError("Un pôle avec ce code existe déjà", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }

    return prisma.pole.create({
      data: {
        name,
        code,
        description,
      },
      include: {
        services: true,
      },
    });
  }

  @Mutation(() => Pole)
  @Authorized([UserRole.SUPERADMIN])
  async updatePole(
    @Arg("id") id: string,
    @Arg("name", { nullable: true }) name?: string,
    @Arg("description", { nullable: true }) description?: string
  ): Promise<Pole> {
    const pole = await prisma.pole.findUnique({
      where: { id }
    });

    if (!pole) {
      throw new GraphQLError("Pôle non trouvé", {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return prisma.pole.update({
      where: { id },
      data: {
        name,
        description,
      },
      include: {
        services: true,
      },
    });
  }

  @Mutation(() => Pole)
  @Authorized([UserRole.SUPERADMIN])
  async deletePole(@Arg("id") id: string): Promise<Pole> {
    const pole = await prisma.pole.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });

    if (!pole) {
      throw new GraphQLError("Pôle non trouvé", {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (pole.services.length > 0) {
      throw new GraphQLError("Impossible de supprimer un pôle qui contient des services", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }

    return prisma.pole.delete({
      where: { id },
      include: {
        services: true,
      },
    });
  }
}
