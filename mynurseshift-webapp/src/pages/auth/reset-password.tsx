import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '@/graphql/auth';

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

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const onFinish = async (values: ResetPasswordForm) => {
    if (!token) {
      message.error('Token de réinitialisation invalide');
      return;
    }

    try {
      const { data } = await resetPassword({
        variables: {
          input: {
            token,
            password: values.password,
          },
        },
      });

      if (data?.resetPassword?.success) {
        message.success('Mot de passe réinitialisé avec succès');
        navigate('/login');
      }
    } catch (error: any) {
      message.error(error.message || 'Une erreur est survenue');
    }
  };

  if (!token) {
    return (
      <Container>
        <StyledCard>
          <Title level={4} style={{ textAlign: 'center' }}>
            Lien de réinitialisation invalide
          </Title>
          <LinksContainer>
            <Link to="/forgot-password">Demander un nouveau lien</Link>
          </LinksContainer>
        </StyledCard>
      </Container>
    );
  }

  return (
    <Container>
      <StyledCard>
        <LogoContainer>
          <Title level={2}>MyNurseShift</Title>
          <Title level={4}>Réinitialiser le mot de passe</Title>
        </LogoContainer>

        <StyledForm
          name="reset-password"
          onFinish={onFinish}
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Veuillez saisir votre nouveau mot de passe' },
              { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nouveau mot de passe"
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
              Réinitialiser le mot de passe
            </Button>
          </Form.Item>

          <LinksContainer>
            <Link to="/login">Retour à la connexion</Link>
          </LinksContainer>
        </StyledForm>
      </StyledCard>
    </Container>
  );
};
