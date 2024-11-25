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
  Select,
} from "antd";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../../graphql/auth";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [register, { loading }] = useMutation(REGISTER_MUTATION);

  const onFinish = async (values: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => {
    try {
      const { data } = await register({
        variables: {
          input: {
            email: values.email,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
            role: values.role,
          },
        },
      });

      if (data?.register?.token) {
        notification.success({
          message: "Success",
          description: "Account created successfully",
        });
        navigate("/login");
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
          <Title level={3}>Create Account</Title>
          <Text type="secondary">
            Create a new administrator account
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="First Name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Last Name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select
              placeholder="Select Role"
              size="large"
            >
              <Option value="ADMIN">Administrator</Option>
              <Option value="SUPER_ADMIN">Super Administrator</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Create Account
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Button
              type="link"
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </Button>
          </div>
        </Form>
      </Card>
    </Layout>
  );
};
