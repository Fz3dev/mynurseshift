export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  USER = 'USER'
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum PoleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ValidationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IPole {
  id: string;
  name: string;
  description?: string;
  status: PoleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IService {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  pole: IPole;
  createdAt: string;
  updatedAt: string;
}

export interface IDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  status: DocumentStatus;
  comment?: string;
  validationId: string;
  validation?: IUserValidation;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserValidation {
  id: string;
  userId: string;
  user?: IUser;
  documents: IDocument[];
  status: ValidationStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  user?: IUser;
  changes: Record<string, any>;
  createdAt: Date;
}
