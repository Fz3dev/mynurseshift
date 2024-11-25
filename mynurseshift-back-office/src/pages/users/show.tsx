import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Button, Space, Spin } from "antd";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../graphql/users";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";

export const UserShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id },
  });

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error loading user</div>;

  const user = data?.user;

  return (
    <Card
      title="User Details"
      extra={
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/users")}
          >
            Back to List
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/${id}/edit`)}
          >
            Edit
          </Button>
        </Space>
      }
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="First Name">{user?.firstName}</Descriptions.Item>
        <Descriptions.Item label="Last Name">{user?.lastName}</Descriptions.Item>
        <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
        <Descriptions.Item label="Role">{user?.role}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(user?.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {new Date(user?.updatedAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
