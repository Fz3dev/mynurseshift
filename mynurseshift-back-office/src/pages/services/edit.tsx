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
import { GET_SERVICE, UPDATE_SERVICE_MUTATION } from "../../graphql/services";
import { GET_POLES } from "../../graphql/poles";
import { ServiceStatus, IService, IPole } from "../../interfaces";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const ServiceEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data, loading } = useQuery(GET_SERVICE, {
    variables: { id },
    onCompleted: (data) => {
      const service = data.service;
      if (service) {
        form.setFieldsValue({
          name: service.name,
          description: service.description,
          status: service.status,
          poleId: service.pole?.id,
        });
      }
    },
  });

  const { data: polesData, loading: polesLoading } = useQuery(GET_POLES);
  const [updateService, { loading: updateLoading }] = useMutation(UPDATE_SERVICE_MUTATION);

  const onFinish = async (values: any) => {
    try {
      await updateService({
        variables: {
          id,
          input: values,
        },
      });
      notification.success({
        message: "Success",
        description: "Medical service updated successfully",
      });
      navigate("/services");
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Error updating medical service",
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

  const service = data?.service;

  if (!service) {
    return <div>Medical service not found</div>;
  }

  return (
    <Card
      title={
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/services")}
          >
            Back to List
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            Edit Medical Service
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
              message: "Please enter the service name",
            },
          ]}
        >
          <Input placeholder="Enter service name" />
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
            placeholder="Enter service description"
          />
        </Form.Item>

        <Form.Item
          label="Medical Pole"
          name="poleId"
          rules={[
            {
              required: true,
              message: "Please select a medical pole",
            },
          ]}
        >
          <Select loading={polesLoading}>
            {polesData?.poles?.map((pole: IPole) => (
              <Option key={pole.id} value={pole.id}>
                {pole.name}
              </Option>
            ))}
          </Select>
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
            <Option value={ServiceStatus.ACTIVE}>Active</Option>
            <Option value={ServiceStatus.INACTIVE}>Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={updateLoading}>
            Update Medical Service
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
