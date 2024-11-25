import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  notification,
  Spin,
  Typography,
  Space,
} from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POLE, UPDATE_POLE_MUTATION } from "../../graphql/poles";
import { PoleStatus, IPole } from "../../interfaces";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const PoleEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data, loading } = useQuery(GET_POLE, {
    variables: { id },
    onCompleted: (data) => {
      const pole = data.pole;
      if (pole) {
        form.setFieldsValue({
          name: pole.name,
          description: pole.description,
          status: pole.status,
        });
      }
    },
  });

  const [updatePole, { loading: updateLoading }] = useMutation(UPDATE_POLE_MUTATION);

  const onFinish = async (values: any) => {
    try {
      await updatePole({
        variables: {
          id,
          input: values,
        },
      });
      notification.success({
        message: "Success",
        description: "Medical pole updated successfully",
      });
      navigate("/poles");
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Error updating medical pole",
      });
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const pole = data?.pole;

  if (!pole) {
    return <div>Medical pole not found</div>;
  }

  return (
    <Card
      title={
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/poles")}
          >
            Back to List
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            Edit Medical Pole
          </Title>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter the pole name",
            },
          ]}
        >
          <Input placeholder="Enter pole name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter a description",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Enter pole description"
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[
            {
              required: true,
              message: "Please select a status",
            },
          ]}
        >
          <Select>
            <Option value={PoleStatus.ACTIVE}>Active</Option>
            <Option value={PoleStatus.INACTIVE}>Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={updateLoading}>
            Update Medical Pole
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
