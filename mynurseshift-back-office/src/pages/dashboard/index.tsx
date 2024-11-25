import React from "react";
import { Table, Tag, Space, Badge, Card } from "antd";
import { gql, useQuery } from "@apollo/client";
import {
  UserOutlined,
  BranchesOutlined,
  AppstoreOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const DashboardContainer = styled.div`
  padding: 24px;
  max-width: 100%;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
  width: 100%;
  white-space: nowrap;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  width: 100%;
`;

const StatsCard = styled(Card)`
  border-radius: 8px;
  height: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  border: none;
  
  .ant-card-body {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  margin-bottom: 8px;
  min-height: 42px;

  .anticon {
    font-size: 18px;
    flex-shrink: 0;
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #111;
`;

const ContentRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
`;

const ContentCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  border: none;

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    min-height: 48px;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const DASHBOARD_STATS = gql`
  query DashboardStats {
    stats {
      totalUsers
      totalPoles
      totalServices
      pendingValidations
      recentUsers {
        id
        firstName
        lastName
        email
        role
        status
      }
      recentValidations {
        id
        user {
          firstName
          lastName
        }
        status
        createdAt
      }
    }
  }
`;

export const Dashboard: React.FC = () => {
  const { data, loading } = useQuery(DASHBOARD_STATS);
  const navigate = useNavigate();
  const stats = data?.stats || {};

  const userColumns = [
    {
      title: 'Utilisateur',
      dataIndex: ['firstName', 'lastName', 'email'],
      key: 'user',
      render: (_: any, record: any) => (
        <>
          <div>{record.firstName} {record.lastName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
        </>
      ),
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'default';
        switch (role) {
          case 'SUPERADMIN':
            color = 'red';
            break;
          case 'ADMIN':
            color = 'blue';
            break;
          case 'USER':
            color = 'green';
            break;
        }
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color;
        switch (status) {
          case 'PENDING':
            color = 'warning';
            break;
          case 'APPROVED':
            color = 'success';
            break;
          case 'REJECTED':
            color = 'error';
            break;
          default:
            color = 'default';
        }
        return <Badge status={color as any} text={status} />;
      },
    },
  ];

  const validationColumns = [
    {
      title: 'Utilisateur',
      dataIndex: ['user', 'firstName'],
      key: 'user',
      render: (_: any, record: any) => (
        <span>{record.user.firstName} {record.user.lastName}</span>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color;
        switch (status) {
          case 'PENDING':
            color = 'warning';
            break;
          case 'APPROVED':
            color = 'success';
            break;
          case 'REJECTED':
            color = 'error';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => (
        new Date(date).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      ),
    },
  ];

  return (
    <DashboardContainer>
      <Title>Tableau de bord</Title>

      <StatsGrid>
        <StatsCard onClick={() => navigate('/users')}>
          <StatHeader>
            <UserOutlined style={{ color: '#1890ff' }} />
            Utilisateurs
          </StatHeader>
          <StatValue>{stats.totalUsers || 0}</StatValue>
        </StatsCard>

        <StatsCard onClick={() => navigate('/poles')}>
          <StatHeader>
            <BranchesOutlined style={{ color: '#52c41a' }} />
            Pôles médicaux
          </StatHeader>
          <StatValue>{stats.totalPoles || 0}</StatValue>
        </StatsCard>

        <StatsCard onClick={() => navigate('/services')}>
          <StatHeader>
            <AppstoreOutlined style={{ color: '#722ed1' }} />
            Services
          </StatHeader>
          <StatValue>{stats.totalServices || 0}</StatValue>
        </StatsCard>

        <StatsCard onClick={() => navigate('/validations')}>
          <StatHeader>
            <SafetyOutlined style={{ color: '#faad14' }} />
            Validations en attente
          </StatHeader>
          <StatValue>{stats.pendingValidations || 0}</StatValue>
        </StatsCard>
      </StatsGrid>

      <ContentRow>
        <ContentCard title="Utilisateurs récents">
          <Table
            loading={loading}
            dataSource={stats.recentUsers || []}
            columns={userColumns}
            pagination={false}
            rowKey="id"
          />
        </ContentCard>
        <ContentCard title="Demandes de validation">
          <Table
            loading={loading}
            dataSource={stats.recentValidations || []}
            columns={validationColumns}
            pagination={false}
            rowKey="id"
          />
        </ContentCard>
      </ContentRow>
    </DashboardContainer>
  );
};
