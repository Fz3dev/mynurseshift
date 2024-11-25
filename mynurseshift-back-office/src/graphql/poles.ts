import { gql } from "@apollo/client";

export const GET_POLES = gql`
  query GetPoles {
    poles {
      id
      name
      description
      createdAt
      services {
        id
        name
      }
    }
  }
`;

export const CREATE_POLE = gql`
  mutation CreatePole($input: CreatePoleInput!) {
    createPole(input: $input) {
      id
      name
      description
      createdAt
      services {
        id
        name
      }
    }
  }
`;

export const DELETE_POLE = gql`
  mutation DeletePole($id: ID!) {
    deletePole(id: $id) {
      id
    }
  }
`;

export const UPDATE_POLE = gql`
  mutation UpdatePole($id: ID!, $input: UpdatePoleInput!) {
    updatePole(id: $id, input: $input) {
      id
      name
      description
      services {
        id
        name
      }
    }
  }
`;
