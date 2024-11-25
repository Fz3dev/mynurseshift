import React from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const { Sider } = Layout;

const Logo = styled.div<{ $collapsed: boolean }>`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.$collapsed ? '14px' : '18px'};
  font-weight: bold;
  transition: all 0.2s;
`;

const StyledSider = styled(Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 101;
  ${props => props.collapsed ? 'width: 80px;' : 'width: 200px;'}
  transition: width 0.2s;
`;

interface SidebarProps {
  collapsed: boolean;
}

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Tableau de bord',
  },
  {
    key: '/services-menu',
    icon: <MedicineBoxOutlined />,
    label: 'Services',
    children: [
      {
        key: '/services',
        label: 'Liste des services',
      },
      {
        key: '/services/create',
        label: 'Créer un service',
      },
    ],
  },
  {
    key: '/poles-menu',
    icon: <ClusterOutlined />,
    label: 'Pôles',
    children: [
      {
        key: '/poles',
        label: 'Liste des pôles',
      },
      {
        key: '/poles/create',
        label: 'Créer un pôle',
      },
    ],
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: 'Utilisateurs',
  },
  {
    key: '/validations',
    icon: <SafetyCertificateOutlined />,
    label: 'Validations',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKeys = [location.pathname];
  const openKeys = menuItems
    .filter((item) => 'children' in item && location.pathname.startsWith(item.key))
    .map((item) => item.key);

  return (
    <StyledSider
      trigger={null}
      collapsible
      collapsed={collapsed ? 1 : 0}
      width={200}
    >
      <Logo $collapsed={collapsed}>
        {collapsed ? 'MNS' : 'MyNurseShift'}
      </Logo>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={openKeys}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </StyledSider>
  );
};
