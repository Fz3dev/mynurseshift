import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Space,
  Button,
  Tag,
  Popconfirm,
  Typography,
  Card,
  notification,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SERVICES, DELETE_SERVICE_MUTATION } from "../../graphql/services";
import { IService, ServiceStatus } from "../../interfaces";
import styled from "styled-components";

const { Title } = Typography;

const StyledTag = styled(Tag)`
  white-space: nowrap !important;
  display: inline-block !important;
  word-break: normal !important;
  height: auto !important;
`;

const TableCell = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledTable = styled(Table)`
  .ant-table-cell {
    white-space: nowrap;
    .ant-tag {
      white-space: nowrap;
    }
  }
`;

export const ServicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, refetch } = useQuery(GET_SERVICES);
  const [deleteService] = useMutation(DELETE_SERVICE_MUTATION);

  const handleDelete = async (id: string) => {
    try {
      await deleteService({
        variables: { id },
      });
      notification.success({
        message: "Success",
        description: "Medical service deleted successfully",
      });
      refetch();
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Error deleting medical service",
      });
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: IService) => (
        <a onClick={() => navigate(`/services/edit/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Medical Pole",
      key: "pole",
      width: 180,
      render: (_: any, record: IService) => (
        <TableCell>
          <StyledTag color="blue">
            {record.pole?.name || "No pole assigned"}
          </StyledTag>
        </TableCell>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ServiceStatus) => (
        <Tag
          icon={status === ServiceStatus.ACTIVE ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={status === ServiceStatus.ACTIVE ? "success" : "error"}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IService) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/services/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this service?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={2}>Services</Title>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/services/create")}
        >
          Create Service
        </Button>
      </Space>
      <StyledTable
        loading={loading}
        dataSource={data?.services || []}
        columns={columns}
        rowKey="id"
      />
    </Card>
  );
};
