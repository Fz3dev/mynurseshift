import React from "react";
import { Table, Card, Typography, Space, Tag } from "antd";
import { useQuery } from "@apollo/client";
import { GET_AUDIT_LOGS } from "../../graphql/audit-logs";

const { Title } = Typography;

export const AuditLogList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_AUDIT_LOGS);

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "success";
      case "UPDATE":
        return "warning";
      case "DELETE":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: any) => (
        <Space direction="vertical" size={0}>
          <span>{`${user.firstName} ${user.lastName}`}</span>
          <span style={{ color: "#666" }}>{user.email}</span>
        </Space>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: string) => (
        <Tag color={getActionColor(action)}>{action.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Resource Type",
      dataIndex: "resourceType",
      key: "resourceType",
    },
    {
      title: "Resource ID",
      dataIndex: "resourceId",
      key: "resourceId",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (details: string) => (
        <div style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>
          {details}
        </div>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
    },
  ];

  if (error) {
    return <div>Error loading audit logs</div>;
  }

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Title level={3}>Audit Logs</Title>
      </div>
      <Table
        columns={columns}
        dataSource={data?.auditLogs}
        loading={loading}
        rowKey="id"
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />
    </Card>
  );
};
