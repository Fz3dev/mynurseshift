import React from "react";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Layout as AntdLayout, Typography, Avatar, Space, Button } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../interfaces";

const { Text, Title } = Typography;
const { Header: AntdHeader } = AntdLayout;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const { mutate: logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AntdHeader
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0px 24px",
        height: "64px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        MyNurseShift Back Office
      </Title>
      <Space>
        <Space style={{ marginRight: "12px" }}>
          <Avatar size="small" icon={<UserOutlined />} />
          {user && (
            <>
              <Text strong>
                {user.firstName} {user.lastName}
              </Text>
              <Text type="secondary">({user.role})</Text>
            </>
          )}
        </Space>
        <Button
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          type="text"
          title="Se déconnecter"
        />
      </Space>
    </AntdHeader>
  );
};
