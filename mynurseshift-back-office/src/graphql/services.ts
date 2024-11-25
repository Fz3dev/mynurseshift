import { gql } from "@apollo/client";

export const GET_SERVICES = gql`
  query GetServices {
    services {
      id
      name
      description
      status
      pole {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    service(id: $id) {
      id
      name
      description
      status
      pole {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SERVICE_MUTATION = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
      name
      description
      status
      pole {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SERVICE_MUTATION = gql`
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      name
      description
      status
      pole {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SERVICE_MUTATION = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      success
      message
    }
  }
`;
