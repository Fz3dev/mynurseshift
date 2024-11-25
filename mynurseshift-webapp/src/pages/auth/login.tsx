import React from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { LOGIN } from '@/graphql/auth';

const { Title, Text } = Typography;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 24px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.98);
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Logo = styled(MedicineBoxOutlined)`
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-input-affix-wrapper {
    padding: 8px 11px;
    height: 42px;
    border-radius: 6px;
    
    &:hover, &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }
  }

  .ant-btn {
    height: 42px;
    border-radius: 6px;
    font-weight: 500;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const StyledLink = styled(Link)`
  color: #1890ff;
  font-size: 14px;
  
  &:hover {
    color: #40a9ff;
  }
`;

interface LoginForm {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [login, { loading }] = useMutation(LOGIN);

  const onFinish = async (values: LoginForm) => {
    try {
      const { data } = await login({
        variables: {
          email: values.email,
          password: values.password,
        },
      });

      if (data?.login?.token) {
        localStorage.setItem('token', data.login.token);
        message.success('Connexion réussie');
        navigate('/');
      }
    } catch (error: any) {
      message.error(error.message || 'Erreur lors de la connexion');
    }
  };

  return (
    <Container>
      <StyledCard>
        <LogoContainer>
          <Logo />
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>MyNurseShift</Title>
          <Text type="secondary">Plateforme de gestion des équipes de santé</Text>
        </LogoContainer>

        <StyledForm
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Veuillez saisir votre email' },
              { type: 'email', message: 'Email invalide' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Mot de passe"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Se connecter
            </Button>
          </Form.Item>

          <LinksContainer>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <StyledLink to="/forgot-password">Mot de passe oublié ?</StyledLink>
              <Text type="secondary">
                Pas encore de compte ?{' '}
                <StyledLink to="/register">S'inscrire</StyledLink>
              </Text>
            </Space>
          </LinksContainer>
        </StyledForm>
      </StyledCard>
    </Container>
  );
};
