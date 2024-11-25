import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import { Service, UserRole } from "../types";
import prisma from "../../prisma";
import { GraphQLError } from "graphql";

@Resolver(Service)
export class ServiceResolver {
  @Query(() => [Service])
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async services(): Promise<Service[]> {
    return prisma.service.findMany({
      include: {
        pole: true,
      },
    });
  }

  @Query(() => Service)
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async service(@Arg("id") id: string): Promise<Service> {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        pole: true,
      },
    });

    if (!service) {
      throw new GraphQLError("Service non trouvé", {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return service;
  }

  @Query(() => [Service])
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async servicesByPole(@Arg("poleId") poleId: string): Promise<Service[]> {
    const pole = await prisma.pole.findUnique({
      where: { id: poleId }
    });

    if (!pole) {
      throw new GraphQLError("Pôle non trouvé", {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return prisma.service.findMany({
      where: {
        poleId,
      },
      include: {
        pole: true,
      },
    });
  }

  @Mutation(() => Service)
  @Authorized([UserRole.SUPERADMIN])
  async createService(
    @Arg("name") name: string,
    @Arg("poleId") poleId: string,
    @Arg("description") description: string,
    @Arg("capacity") capacity: number
  ): Promise<Service> {
    const pole = await prisma.pole.findUnique({
      where: { id: poleId }
    });

    if (!pole) {
      throw new GraphQLError("Pôle non trouvé", {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (capacity < 0) {
      throw new GraphQLError("La capacité doit être positive", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }

    return prisma.service.create({
      data: {
        name,
        description,
        capacity,
        pole: {
          connect: { id: poleId },
        },
      },
      include: {
        pole: true,
      },
    });
  }

  @Mutation(() => Service)
  @Authorized([UserRole.SUPERADMIN])
  async updateService(
    @Arg("id") id: string,
    @Arg("name", { nullable: true }) name?: string,
    @Arg("description", { nullable: true }) description?: string,
    @Arg("capacity", { nullable: true }) capacity?: number,
    @Arg("poleId", { nullable: true }) poleId?: string
  ): Promise<Service> {
    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      throw new GraphQLError("Service non trouvé", {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (poleId) {
      const pole = await prisma.pole.findUnique({
        where: { id: poleId }
      });

      if (!pole) {
        throw new GraphQLError("Pôle non trouvé", {
          extensions: { code: 'NOT_FOUND' }
        });
      }
    }

    if (capacity !== undefined && capacity < 0) {
      throw new GraphQLError("La capacité doit être positive", {
        extensions: { code: 'BAD_USER_INPUT' }
      });
    }

    const data: any = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (capacity !== undefined) data.capacity = capacity;
    if (poleId) data.pole = { connect: { id: poleId } };

    return prisma.service.update({
      where: { id },
      data,
      include: {
        pole: true,
      },
    });
  }

  @Mutation(() => Service)
  @Authorized([UserRole.SUPERADMIN])
  async deleteService(@Arg("id") id: string): Promise<Service> {
    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      throw new GraphQLError("Service non trouvé", {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return prisma.service.delete({
      where: { id },
      include: {
        pole: true,
      },
    });
  }
}
