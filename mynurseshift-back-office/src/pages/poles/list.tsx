import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Card, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import styled from 'styled-components';
import { GET_POLES } from '../../graphql/poles';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #1f1f1f;
`;

const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 24px;
  }
`;

export const PolesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_POLES);

  if (error) {
    message.error('Erreur lors du chargement des pôles');
  }

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Services',
      dataIndex: 'services',
      key: 'services',
      render: (services: any[]) => (
        <Space size={[0, 8]} wrap>
          {services?.map((service: any) => (
            <Tag color="blue" key={service.id}>
              {service.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Date de création',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'Pp', { locale: fr }),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/poles/edit/${record.id}`)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              // TODO: Implement delete functionality
              message.success('Pôle supprimé avec succès');
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <Title>Liste des pôles</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/poles/create')}
        >
          Créer un pôle
        </Button>
      </PageHeader>

      <StyledCard>
        <Table
          columns={columns}
          dataSource={data?.poles}
          loading={loading}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} pôles`,
          }}
        />
      </StyledCard>
    </div>
  );
};
