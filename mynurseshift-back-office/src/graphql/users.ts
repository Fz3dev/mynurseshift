import { gql } from "@apollo/client";

const USER_FIELDS = `
  id
  firstName
  lastName
  email
  role
  status
  position
  createdAt
  updatedAt
  service {
    id
    name
    description
  }
  supervisor {
    id
    firstName
    lastName
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      ${USER_FIELDS}
    }
  }
`;

export const GET_PENDING_USERS = gql`
  query GetPendingUsers {
    pendingUsers {
      ${USER_FIELDS}
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ${USER_FIELDS}
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $role: UserRole!
    $serviceId: Int
    $supervisorId: Int
  ) {
    register(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      role: $role
      serviceId: $serviceId
      supervisorId: $supervisorId
    ) {
      ${USER_FIELDS}
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ${USER_FIELDS}
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const APPROVE_USER = gql`
  mutation ApproveUser($id: ID!) {
    approveUser(id: $id) {
      ${USER_FIELDS}
    }
  }
`;

export const REJECT_USER = gql`
  mutation RejectUser($id: ID!) {
    rejectUser(id: $id) {
      ${USER_FIELDS}
    }
  }
`;
