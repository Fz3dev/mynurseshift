import React from "react";
import { useMenu, useNavigation } from "@refinedev/core";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  BranchesOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  AuditOutlined,
} from "@ant-design/icons";

const { Sider: AntdSider } = Layout;

export const Sider: React.FC = () => {
  const { menuItems, selectedKey } = useMenu();
  const { push } = useNavigation();

  const menuIcons: { [key: string]: React.ReactNode } = {
    dashboard: <DashboardOutlined />,
    users: <TeamOutlined />,
    poles: <BranchesOutlined />,
    services: <AppstoreOutlined />,
    validations: <SafetyOutlined />,
    "audit-logs": <AuditOutlined />,
  };

  return (
    <AntdSider
      style={{
        height: "100vh",
        position: "sticky",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: menuIcons[item.name],
          label: item.label,
          onClick: () => push(item.route),
        }))}
      />
    </AntdSider>
  );
};
