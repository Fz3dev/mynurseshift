import { useLogin } from "@refinedev/core";
import { Row, Col, Layout, Card, Typography, Form, Input, Button, notification } from "antd";
import { gql, useMutation } from "@apollo/client";
import React from "react";

const { Title } = Typography;
const { Content } = Layout;

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
        status
      }
    }
  }
`;

export const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { mutate: login } = useLogin();
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const { data } = await loginMutation({
        variables: {
          email: values.email,
          password: values.password,
        },
      });

      if (data?.login) {
        const { token, user } = data.login;
        
        login({
          token,
          user: {
            id: user.id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            role: user.role,
            status: user.status,
          },
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Erreur de connexion",
        description: error.message || "Une erreur est survenue lors de la connexion",
      });
    }
  };

  return (
    <Layout style={{ height: "100vh", background: "#f0f2f5" }}>
      <Content>
        <Row
          justify="center"
          align="middle"
          style={{
            height: "100vh",
          }}
        >
          <Col xs={22} sm={18} md={12} lg={8} xl={6}>
            <Card
              title={
                <Title level={3} style={{ textAlign: "center", margin: 0 }}>
                  MyNurseShift Back Office
                </Title>
              }
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "L'email est requis" },
                    { type: "email", message: "Email invalide" },
                  ]}
                >
                  <Input size="large" placeholder="admin@mynurseshift.com" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Mot de passe"
                  rules={[{ required: true, message: "Le mot de passe est requis" }]}
                >
                  <Input.Password size="large" placeholder="●●●●●●●●" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    block
                    style={{ marginTop: 20 }}
                  >
                    Se connecter
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
