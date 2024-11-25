import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD } from '@/graphql/auth';

const { Title, Text } = Typography;

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

const Description = styled(Text)`
  display: block;
  text-align: center;
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.45);
`;

const LinksContainer = styled.div`
  text-align: center;
  margin-top: 24px;
`;

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPassword: React.FC = () => {
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);

  const onFinish = async (values: ForgotPasswordForm) => {
    try {
      const { data } = await forgotPassword({
        variables: {
          email: values.email,
        },
      });

      if (data?.forgotPassword?.success) {
        message.success(
          'Si un compte existe avec cet email, vous recevrez les instructions pour réinitialiser votre mot de passe'
        );
      }
    } catch (error: any) {
      message.error(error.message || 'Une erreur est survenue');
    }
  };

  return (
    <Container>
      <StyledCard>
        <LogoContainer>
          <Title level={2}>MyNurseShift</Title>
          <Title level={4}>Mot de passe oublié</Title>
        </LogoContainer>

        <Description>
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
        </Description>

        <StyledForm
          name="forgot-password"
          onFinish={onFinish}
        >
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Envoyer les instructions
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
