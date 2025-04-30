import { UserRole, UserStatus } from "@prisma/client";

//  Logged in user Data Type
export type TAuthUser = {
  email: string;
  role: UserRole;
  status: UserStatus;
} | null;
