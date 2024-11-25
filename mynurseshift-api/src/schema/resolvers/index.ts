import { NonEmptyArray } from "type-graphql";
import { UserResolver } from "./user.resolver";
import { DashboardResolver } from "./dashboard.resolver";

export const resolvers: NonEmptyArray<Function> = [
  UserResolver,
  DashboardResolver,
];
