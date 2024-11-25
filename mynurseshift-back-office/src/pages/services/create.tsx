import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  notification,
  Typography,
  Space,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_SERVICE_MUTATION } from "../../graphql/services";
import { GET_POLES } from "../../graphql/poles";
import { ServiceStatus, IPole } from "../../interfaces";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

export const ServiceCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [createService, { loading: createLoading }] = useMutation(CREATE_SERVICE_MUTATION, {
    onError: (error) => {
      notification.error({
        message: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du service",
      });
    },
  });

  const { data: polesData, loading: polesLoading, error: polesError } = useQuery(GET_POLES, {
    onError: (error) => {
      notification.error({
        message: "Erreur",
        description: error.message || "Impossible de charger les pôles médicaux",
      });
    },
  });

  const onFinish = async (values: any) => {
    try {
      await createService({
        variables: {
          input: values,
        },
      });
      notification.success({
        message: "Succès",
        description: "Le service a été créé avec succès",
      });
      navigate("/services");
    } catch (error) {
      // L'erreur sera gérée par le onError du useMutation
    }
  };

  if (polesError) {
    return (
      <Card>
        <Title level={4}>Erreur de chargement</Title>
        <p>Impossible de charger les pôles médicaux. Veuillez réessayer plus tard.</p>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/services")}>
          Retour à la liste
        </Button>
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/services")}
          >
            Retour à la liste
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            Créer un service
          </Title>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: ServiceStatus.ACTIVE,
        }}
      >
        <Form.Item
          name="name"
          label="Nom"
          rules={[
            { required: true, message: "Le nom du service est requis" },
            { max: 100, message: "Le nom ne peut pas dépasser 100 caractères" },
          ]}
        >
          <Input placeholder="Entrez le nom du service" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "La description du service est requise" },
            { max: 500, message: "La description ne peut pas dépasser 500 caractères" },
          ]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Entrez la description du service"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          name="poleId"
          label="Pôle médical"
          rules={[{ required: true, message: "Veuillez sélectionner un pôle médical" }]}
        >
          <Select
            loading={polesLoading}
            placeholder="Sélectionnez un pôle médical"
            notFoundContent={polesLoading ? "Chargement..." : "Aucun pôle médical trouvé"}
          >
            {polesData?.poles?.map((pole: IPole) => (
              <Option key={pole.id} value={pole.id}>
                {pole.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Statut"
          rules={[{ required: true, message: "Veuillez sélectionner un statut" }]}
        >
          <Select>
            <Option value={ServiceStatus.ACTIVE}>Actif</Option>
            <Option value={ServiceStatus.INACTIVE}>Inactif</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading}
              disabled={polesLoading}
            >
              Créer
            </Button>
            <Button onClick={() => navigate("/services")}>
              Annuler
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
