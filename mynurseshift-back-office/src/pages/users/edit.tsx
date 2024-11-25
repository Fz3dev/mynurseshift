import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  notification,
  Space,
  Spin,
  Select,
} from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER, UPDATE_USER } from "../../graphql/users";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Option } = Select;

export const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { loading: loadingUser, error: errorUser, data } = useQuery(GET_USER, {
    variables: { id },
    onCompleted: (data) => {
      form.setFieldsValue({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
      });
    },
  });

  const [updateUser, { loading: loadingUpdate }] = useMutation(UPDATE_USER);

  const onFinish = async (values: any) => {
    try {
      await updateUser({
        variables: {
          id,
          input: values,
        },
      });
      notification.success({
        message: "Succès",
        description: "Utilisateur mis à jour avec succès",
      });
      navigate("/users");
    } catch (error: any) {
      notification.error({
        message: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
    }
  };

  if (loadingUser) return <Spin size="large" />;
  if (errorUser) return <div>Erreur lors du chargement de l'utilisateur</div>;

  return (
    <Card
      title="Modifier l'utilisateur"
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
          name="role"
          label="Rôle"
          rules={[{ required: true, message: "Veuillez sélectionner un rôle" }]}
        >
          <Select>
            <Option value="USER">Utilisateur</Option>
            <Option value="ADMIN">Administrateur</Option>
            <Option value="SUPERADMIN">Super Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingUpdate}
            >
              Enregistrer
            </Button>
            <Button onClick={() => navigate("/users")}>Annuler</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
