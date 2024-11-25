import { gql } from "@apollo/client";

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs {
    auditLogs {
      id
      action
      resourceType
      resourceId
      details
      ipAddress
      createdAt
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
