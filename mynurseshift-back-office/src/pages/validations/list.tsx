import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Space,
  Button,
  Typography,
  Card,
  notification,
  Tag,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PENDING_USERS, APPROVE_USER, REJECT_USER } from "../../graphql/users";
import { useAuth } from "../../hooks/useAuth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title } = Typography;

export const ValidationsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  const { data, loading, refetch } = useQuery(GET_PENDING_USERS, {
    onError: (error) => {
      notification.error({
        message: "Erreur",
        description: error.message || "Erreur lors du chargement des utilisateurs en attente",
      });
    },
  });

  const [approveUser] = useMutation(APPROVE_USER, {
    onCompleted: () => {
      notification.success({
        message: "Succès",
        description: "Utilisateur validé avec succès",
      });
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: "Erreur",
        description: error.message || "Erreur lors de la validation de l'utilisateur",
      });
    },
  });

  const [rejectUser] = useMutation(REJECT_USER, {
    onCompleted: () => {
      notification.success({
        message: "Succès",
        description: "Utilisateur refusé avec succès",
      });
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: "Erreur",
        description: error.message || "Erreur lors du refus de l'utilisateur",
      });
    },
  });

  const handleApprove = async (id: string) => {
    try {
      await approveUser({ variables: { id } });
    } catch (error) {
      // Error handled by onError callback
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectUser({ variables: { id } });
    } catch (error) {
      // Error handled by onError callback
    }
  };

  const columns = [
    {
      title: "Nom",
      key: "name",
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          <span>{`${record.firstName} ${record.lastName}`}</span>
          <Typography.Text type="secondary">{record.email}</Typography.Text>
          {record.position && (
            <Typography.Text type="secondary">
              Position: {record.position}
            </Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: "Service",
      key: "service",
      render: (_: any, record: any) => (
        record.service ? (
          <Space direction="vertical" size="small">
            <span>{record.service.name}</span>
            <Typography.Text type="secondary">
              {record.service.description}
            </Typography.Text>
          </Space>
        ) : (
          <Tag color="warning">Non assigné</Tag>
        )
      ),
    },
    {
      title: "Superviseur",
      key: "supervisor",
      render: (_: any, record: any) => (
        record.supervisor ? (
          <span>{`${record.supervisor.firstName} ${record.supervisor.lastName}`}</span>
        ) : (
          <Tag color="warning">Non assigné</Tag>
        )
      ),
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const roleColors = {
          SUPERADMIN: 'red',
          ADMIN: 'blue',
          USER: 'green',
        };
        const roleLabels = {
          SUPERADMIN: 'Super Admin',
          ADMIN: 'Cadre de santé',
          USER: 'Infirmier',
        };
        return (
          <Tag color={roleColors[role as keyof typeof roleColors]}>
            {roleLabels[role as keyof typeof roleLabels]}
          </Tag>
        );
      },
    },
    {
      title: "Date d'inscription",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/users/${record.id}`)}
          >
            Voir
          </Button>
          {isAdmin && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                Valider
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record.id)}
              >
                Refuser
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Title level={3}>Utilisateurs en attente de validation</Title>
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
