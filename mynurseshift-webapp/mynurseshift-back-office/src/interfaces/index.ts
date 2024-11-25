export type UserRole = 'ADMIN' | 'SUPERADMIN' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  position?: string;
  workingHours?: any;
  createdAt: string;
  updatedAt: string;
}

export type PoleStatus = 'ACTIVE' | 'INACTIVE';

export interface IPole {
  id: number;
  name: string;
  description: string;
  code: string;
  status: PoleStatus;
  createdAt: string;
  updatedAt: string;
}

export type ServiceStatus = 'ACTIVE' | 'INACTIVE';

export interface IService {
  id: number;
  name: string;
  description: string;
  poleId: number;
  pole?: IPole;
  capacity: number;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}
