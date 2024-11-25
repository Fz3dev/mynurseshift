import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  notification,
  Space,
  Select,
} from "antd";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../graphql/users";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { UserRole } from "../../interfaces";

const { Option } = Select;

interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      notification.success({
        message: "Succès",
        description: "Utilisateur créé avec succès",
      });
      navigate("/users");
    },
    onError: (error) => {
      notification.error({
        message: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
    },
  });

  const onFinish = async (values: CreateUserInput) => {
    try {
      await createUser({
        variables: values,
      });
    } catch (error) {
      // Error handled by onError callback
    }
  };

  return (
    <Card
      title="Créer un utilisateur"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/users")}
        >
          Retour à la liste
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="firstName"
          label="Prénom"
          rules={[{ required: true, message: "Veuillez saisir le prénom" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Nom"
          rules={[{ required: true, message: "Veuillez saisir le nom" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Veuillez saisir l'email" },
            { type: "email", message: "Veuillez saisir un email valide" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mot de passe"
          rules={[
            { required: true, message: "Veuillez saisir le mot de passe" },
            { min: 6, message: "Le mot de passe doit contenir au moins 6 caractères" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="role"
          label="Rôle"
          rules={[{ required: true, message: "Veuillez sélectionner un rôle" }]}
        >
          <Select>
            <Option value={UserRole.USER}>Utilisateur</Option>
            <Option value={UserRole.ADMIN}>Administrateur</Option>
            <Option value={UserRole.SUPERADMIN}>Super Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Créer
            </Button>
            <Button onClick={() => navigate("/users")}>Annuler</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
