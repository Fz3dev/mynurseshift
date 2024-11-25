import React from "react";
import { Table, Space, Button, Card, Typography, notification, Tag } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { GET_PENDING_USERS, APPROVE_USER, REJECT_USER } from "../../graphql/users";

const { Title } = Typography;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'INACTIVE':
      return 'error';
    case 'PENDING':
      return 'warning';
    default:
      return 'default';
  }
};

export const Validations: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_PENDING_USERS);
  const [approveUser] = useMutation(APPROVE_USER);
  const [rejectUser] = useMutation(REJECT_USER);

  const handleApprove = async (id: string) => {
    try {
      await approveUser({
        variables: { id },
      });
      notification.success({
        message: "Succès",
        description: "Utilisateur validé avec succès",
      });
      refetch();
    } catch (error: any) {
      notification.error({
        message: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectUser({
        variables: { id },
      });
      notification.success({
        message: "Succès",
        description: "Utilisateur refusé",
      });
      refetch();
    } catch (error: any) {
      notification.error({
        message: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
    }
  };

  const columns = [
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status === 'ACTIVE' ? 'Validé' :
           status === 'INACTIVE' ? 'Refusé' :
           status === 'PENDING' ? 'En attente' : status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
          >
            Valider
          </Button>
          <Button
            type="primary"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleReject(record.id)}
          >
            Refuser
          </Button>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div>Erreur lors du chargement des utilisateurs</div>;
  }

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Title level={3}>Validations en attente</Title>
      </div>
      <Table
        columns={columns}
        dataSource={data?.pendingUsers}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
};
