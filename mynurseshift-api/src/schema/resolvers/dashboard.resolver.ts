import { Resolver, Query, Authorized } from "type-graphql";
import { DashboardStats, UserRole, UserStatus } from "../types";
import prisma from "../../prisma";

@Resolver()
export class DashboardResolver {
  @Query(() => DashboardStats)
  @Authorized([UserRole.ADMIN, UserRole.SUPERADMIN])
  async stats(): Promise<DashboardStats> {
    const [
      totalUsers,
      totalPoles,
      totalServices,
      pendingValidations,
      recentUsers,
      validationRecords,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.pole.count(),
      prisma.service.count(),
      prisma.user.count({
        where: {
          status: UserStatus.PENDING,
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          service: true,
          supervisor: true,
        },
      }),
      prisma.user.findMany({
        where: {
          status: {
            in: [UserStatus.ACTIVE, UserStatus.INACTIVE],
          },
        },
        take: 5,
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          service: true,
          supervisor: true,
        },
      }),
    ]);

    const recentValidations = validationRecords.map((user) => ({
      id: user.id,
      user: user,
      status: user.status,
      createdAt: user.updatedAt,
    }));

    return {
      totalUsers,
      totalPoles,
      totalServices,
      pendingValidations,
      recentUsers,
      recentValidations,
    };
  }
}
