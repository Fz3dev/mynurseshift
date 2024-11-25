import React from "react";
import { Table, Space, Button, Card, Typography, notification, Tag, Popconfirm } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_USERS, DELETE_USER, APPROVE_USER, REJECT_USER } from "../../graphql/users";
import { DeleteOutlined, EditOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

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

export const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER);
  const [approveUser] = useMutation(APPROVE_USER);
  const [rejectUser] = useMutation(REJECT_USER);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser({
        variables: { id },
      });
      notification.success({
        message: "Succès",
        description: "Utilisateur supprimé avec succès",
      });
      refetch();
    } catch (error: any) {
      notification.error({
        message: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
    }
  };

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
      render: (role: string) => {
        switch (role) {
          case 'SUPERADMIN':
            return 'Super Admin';
          case 'ADMIN':
            return 'Administrateur';
          case 'USER':
            return 'Utilisateur';
          default:
            return role;
        }
      },
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
            icon={<EyeOutlined />}
            onClick={() => navigate(`/users/${record.id}`)}
          >
            Voir
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/${record.id}/edit`)}
          >
            Modifier
          </Button>
          {record.status === 'PENDING' && (
            <>
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
            </>
          )}
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div>Erreur lors du chargement des utilisateurs</div>;
  }

  return (
    <Card>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Utilisateurs</Title>
        <Button
          type="primary"
          onClick={() => navigate("/users/new")}
        >
          Créer un utilisateur
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.users}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
};
