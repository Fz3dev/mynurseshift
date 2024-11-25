import { gql } from "@apollo/client";

export const VALIDATIONS_LIST_QUERY = gql`
  query GetValidations($page: Int, $limit: Int, $status: ValidationStatus) {
    validations(page: $page, limit: $limit, status: $status) {
      data {
        id
        user {
          id
          firstName
          lastName
          email
          role
          status
        }
        documents {
          id
          type
          url
          status
          comment
        }
        status
        comment
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const VALIDATION_DETAILS_QUERY = gql`
  query GetValidation($id: ID!) {
    validation(id: $id) {
      id
      user {
        id
        firstName
        lastName
        email
        role
        status
        phone
        address
        city
        country
      }
      documents {
        id
        type
        url
        status
        comment
      }
      status
      comment
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_VALIDATION_STATUS_MUTATION = gql`
  mutation UpdateValidationStatus(
    $id: ID!
    $status: ValidationStatus!
    $comment: String
  ) {
    updateValidationStatus(id: $id, status: $status, comment: $comment) {
      id
      status
      comment
      updatedAt
    }
  }
`;

export const UPDATE_DOCUMENT_STATUS_MUTATION = gql`
  mutation UpdateDocumentStatus(
    $id: ID!
    $status: DocumentStatus!
    $comment: String
  ) {
    updateDocumentStatus(id: $id, status: $status, comment: $comment) {
      id
      status
      comment
      updatedAt
    }
  }
`;
