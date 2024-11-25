import React, { useState } from "react";
import { Table, Card, Button, Modal, Space, Tag, Tooltip, message } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, DELETE_USER } from "../../graphql/users";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserRole, UserStatus } from "../../interfaces";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const { confirm } = Modal;

const PageContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    min-height: 48px;
  }

  .ant-card-head-title {
    font-size: 16px;
    font-weight: 600;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  color: #1a3353;
  font-size: 24px;
  font-weight: 600;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
  }
`;

const UserAvatar = styled.div<{ $status: UserStatus }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => 
    props.$status === UserStatus.ACTIVE ? '#52c41a' :
    props.$status === UserStatus.PENDING ? '#faad14' : '#ff4d4f'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 16px;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #1a3353;
`;

const UserEmail = styled.span`
  color: #666;
  font-size: 12px;
`;

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleDelete = (id: string) => {
    confirm({
      title: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
      icon: <ExclamationCircleOutlined />,
      content: "Cette action est irréversible.",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      async onOk() {
        try {
          await deleteUser({ variables: { id } });
          message.success("Utilisateur supprimé avec succès");
          refetch();
        } catch (error) {
          message.error("Erreur lors de la suppression de l'utilisateur");
        }
      },
    });
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPERADMIN:
        return "magenta";
      case UserRole.ADMIN:
        return "blue";
      default:
        return "green";
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "success";
      case UserStatus.PENDING:
        return "warning";
      case UserStatus.SUSPENDED:
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Utilisateur",
      key: "user",
      render: (record: any) => (
        <Space>
          <UserAvatar $status={record.status}>
            {record.firstName[0].toUpperCase()}
          </UserAvatar>
          <UserInfo>
            <UserName>{`${record.firstName} ${record.lastName}`}</UserName>
            <UserEmail>{record.email}</UserEmail>
          </UserInfo>
        </Space>
      ),
      sorter: (a: any, b: any) => 
        (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName),
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
      render: (role: UserRole) => (
        <Tag color={getRoleColor(role)}>{role}</Tag>
      ),
      filters: Object.values(UserRole).map(role => ({
        text: role,
        value: role,
      })),
      onFilter: (value: string, record: any) => record.role === value,
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status: UserStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: Object.values(UserStatus).map(status => ({
        text: status,
        value: status,
      })),
      onFilter: (value: string, record: any) => record.status === value,
    },
    {
      title: "Date d'inscription",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Tooltip title={format(new Date(date), 'PPPp', { locale: fr })}>
          {format(new Date(date), 'dd/MM/yyyy', { locale: fr })}
        </Tooltip>
      ),
      sorter: (a: any, b: any) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/${record.id}`)}
          >
            Modifier
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement des utilisateurs</div>;

  return (
    <PageContainer>
      <HeaderContainer>
        <Title>Utilisateurs</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/users/create")}
        >
          Ajouter un utilisateur
        </Button>
      </HeaderContainer>

      <StyledCard>
        <StyledTable
          columns={columns}
          dataSource={data?.users}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} utilisateurs`,
          }}
        />
      </StyledCard>
    </PageContainer>
  );
};

export default UsersPage;
