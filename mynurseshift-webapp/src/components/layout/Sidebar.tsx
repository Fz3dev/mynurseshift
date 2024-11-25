import React from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
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
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Tableau de bord',
  },
  {
    key: '/planning',
    icon: <CalendarOutlined />,
    label: 'Planning',
  },
  {
    key: '/profile',
    icon: <UserOutlined />,
    label: 'Mon profil',
  },
  {
    key: '/team',
    icon: <TeamOutlined />,
    label: 'Mon équipe',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Paramètres',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <StyledSider trigger={null} collapsible collapsed={collapsed}>
      <Logo $collapsed={collapsed}>
        {collapsed ? 'MNS' : 'MyNurseShift'}
      </Logo>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </StyledSider>
  );
};
