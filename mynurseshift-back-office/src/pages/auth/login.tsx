import React from "react";
import { Card, Form, Input, Button, Typography, Layout, theme, Space } from "antd";
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styled from "styled-components";

const { Title, Text } = Typography;

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #001529 0%, #003a75 100%);
  padding: 24px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 440px;
  padding: 32px !important;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.98);
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Logo = styled(SafetyCertificateOutlined)`
  font-size: 56px;
  color: #1890ff;
  margin-bottom: 20px;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-input-affix-wrapper {
    padding: 12px 16px;
    height: 48px;
    border-radius: 8px;
    background: #f5f8ff;
    border: 1px solid #e6ebf5;
    
    &:hover, &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }

    .anticon {
      color: #1890ff;
    }
  }

  .ant-form-item-label > label {
    font-weight: 500;
    color: #1f1f1f;
  }

  .ant-btn {
    height: 48px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.25);
  }
`;

interface LoginFormValues {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const { token: themeToken } = theme.useToken();
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loginMutation, { loading: mutationLoading }] = useMutation(LOGIN_MUTATION);

  React.useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await loginMutation({
        variables: values,
      });

      if (response.data?.login) {
        const { token, user } = response.data.login;
        await login(token, user);
      }
    } catch (error) {
      // L'erreur sera gérée par le hook useAuth
    }
  };

  return (
    <StyledLayout>
      <StyledCard>
        <LogoContainer>
          <Logo />
          <Title level={2} style={{ margin: 0, color: '#1890ff', fontSize: '32px' }}>
            MyNurseShift
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Espace Administration
          </Text>
        </LogoContainer>

        <StyledForm
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          disabled={mutationLoading || authLoading}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "L'email est requis" },
              { type: "email", message: "Veuillez entrer un email valide" },
              { max: 255, message: "L'email ne peut pas dépasser 255 caractères" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Votre email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[
              { required: true, message: "Le mot de passe est requis" },
              { min: 8, message: "Le mot de passe doit contenir au moins 8 caractères" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Votre mot de passe"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={mutationLoading || authLoading}
            >
              Se connecter
            </Button>
          </Form.Item>

          <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
            <Text type="secondary">
              Espace réservé aux administrateurs
            </Text>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              En cas de problème, contactez le support technique
            </Text>
          </Space>
        </StyledForm>
      </StyledCard>
    </StyledLayout>
  );
};
