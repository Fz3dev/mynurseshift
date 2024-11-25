import React from "react";
import { useTable, List } from "@refinedev/antd";
import { Table, Space, Button, Tag } from "antd";
import { gql, useQuery } from "@apollo/client";
import { IUser, UserRole, UserStatus } from "../../interfaces";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      firstName
      lastName
      role
      status
      createdAt
      updatedAt
    }
  }
`;

export const UserList: React.FC = () => {
  const { tableProps } = useTable<IUser>({
    resource: "users",
    meta: {
      gqlQuery: GET_USERS,
    },
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "SUPERADMIN":
        return "red";
      case "ADMIN":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Prénom",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Nom",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
      render: (role: UserRole) => (
        <Tag color={getRoleColor(role)}>{role}</Tag>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status: UserStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IUser) => (
        <Space>
          <Button type="link" href={`/users/show/${record.id}`}>
            Voir
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <List>
      <Table {...tableProps} columns={columns} rowKey="id" />
    </List>
  );
};
