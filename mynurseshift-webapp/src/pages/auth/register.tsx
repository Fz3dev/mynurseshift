import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { REGISTER } from '@/graphql/auth';

const { Title } = Typography;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }
`;

const LinksContainer = styled.div`
  text-align: center;
  margin-top: 24px;
`;

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [register, { loading }] = useMutation(REGISTER);

  const onFinish = async (values: RegisterForm) => {
    try {
      const { data } = await register({
        variables: {
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        },
      });

      if (data?.register) {
        message.success('Inscription réussie ! Votre compte est en attente de validation.');
        navigate('/login');
      }
    } catch (error: any) {
      message.error(error.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <Container>
      <StyledCard>
        <LogoContainer>
          <Title level={2}>MyNurseShift</Title>
          <Title level={4}>Inscription</Title>
        </LogoContainer>

        <StyledForm
          name="register"
          onFinish={onFinish}
        >
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: 'Veuillez saisir votre prénom' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Prénom"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: 'Veuillez saisir votre nom' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nom"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Veuillez saisir votre email' },
              { type: 'email', message: 'Email invalide' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Veuillez saisir votre mot de passe' },
              { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mot de passe"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirmer le mot de passe"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              S'inscrire
            </Button>
          </Form.Item>

          <LinksContainer>
            <Link to="/login">Déjà inscrit ? Se connecter</Link>
          </LinksContainer>
        </StyledForm>
      </StyledCard>
    </Container>
  );
};
