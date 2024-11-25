import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  notification,
  Layout,
} from "antd";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD_MUTATION } from "../../graphql/auth";
import { MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION);

  const onFinish = async (values: { email: string }) => {
    try {
      const { data } = await forgotPassword({
        variables: {
          email: values.email,
        },
      });

      if (data?.forgotPassword?.success) {
        notification.success({
          message: "Success",
          description: "Password reset instructions have been sent to your email",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "Error",
          description: data?.forgotPassword?.message || "Something went wrong",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Something went wrong",
      });
    }
  };

  return (
    <Layout style={{ 
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f0f2f5"
    }}>
      <Card
        style={{
          width: 400,
          maxWidth: "90%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>Forgot Password</Title>
          <Text type="secondary">
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Send Reset Instructions
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Button
              type="link"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </div>
        </Form>
      </Card>
    </Layout>
  );
};
