import React, { useState } from "react";
import { Table, Card, Button, Modal, Form, Input, message, Space, Tag, Tooltip } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POLES } from "../../graphql/poles";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

const ServiceTag = styled(Tag)\`
  margin: 4px;
  padding: 4px 8px;
  border-radius: 4px;
\`;

interface Pole {
  id: string;
  name: string;
  description?: string;
  services?: Array<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const PolesPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPole, setEditingPole] = useState<Pole | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_POLES);

  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Pole) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500, color: '#1a3353' }}>{text}</span>
          {record.description && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              {record.description}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: "Services",
      dataIndex: "services",
      key: "services",
      render: (services: Array<{ id: string; name: string }>) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {services?.map((service) => (
            <ServiceTag key={service.id} color="blue">
              {service.name}
            </ServiceTag>
          ))}
        </div>
      ),
    },
    {
      title: "Date de création",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Tooltip title={format(new Date(date), 'PPPp', { locale: fr })}>
          {format(new Date(date), 'dd/MM/yyyy', { locale: fr })}
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Pole) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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

  const handleEdit = (pole: Pole) => {
    setEditingPole(pole);
    form.setFieldsValue(pole);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer ce pôle ?",
      content: "Cette action est irréversible.",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: async () => {
        try {
          // Add delete mutation here
          message.success("Pôle supprimé avec succès");
          refetch();
        } catch (error) {
          message.error("Erreur lors de la suppression du pôle");
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingPole) {
        // Add update mutation here
      } else {
        // Add create mutation here
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingPole(null);
      refetch();
      message.success(\`Pôle \${editingPole ? 'modifié' : 'créé'} avec succès\`);
    } catch (error) {
      message.error("Erreur lors de la sauvegarde du pôle");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement des pôles</div>;

  return (
    <PageContainer>
      <HeaderContainer>
        <Title>Pôles</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingPole(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Ajouter un pôle
        </Button>
      </HeaderContainer>

      <StyledCard>
        <StyledTable
          columns={columns}
          dataSource={data?.poles}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => \`Total \${total} pôles\`,
          }}
        />
      </StyledCard>

      <Modal
        title={editingPole ? "Modifier le pôle" : "Créer un pôle"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingPole(null);
        }}
        okText={editingPole ? "Modifier" : "Créer"}
        cancelText="Annuler"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingPole || {}}
        >
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: "Le nom est requis" }]}
          >
            <Input placeholder="Nom du pôle" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              placeholder="Description du pôle"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default PolesPage;
