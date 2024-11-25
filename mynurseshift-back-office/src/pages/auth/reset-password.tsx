import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { RESET_PASSWORD_MUTATION } from "../../graphql/auth";
import { LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [form] = Form.useForm();

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION);

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      notification.error({
        message: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    try {
      const { data } = await resetPassword({
        variables: {
          token,
          password: values.password,
        },
      });

      if (data?.resetPassword?.success) {
        notification.success({
          message: "Success",
          description: "Your password has been reset successfully",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "Error",
          description: data?.resetPassword?.message || "Something went wrong",
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
          <Title level={3}>Reset Password</Title>
          <Text type="secondary">
            Please enter your new password.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your new password",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters long",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="New Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please confirm your new password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Confirm New Password"
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
              Reset Password
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
