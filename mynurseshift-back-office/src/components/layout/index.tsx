import React, { useState } from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const { Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`;

const MainLayout = styled(AntLayout)`
  background: #f5f5f5;
`;

const StyledContent = styled(Content)`
  margin: 88px 16px 16px;
  min-height: calc(100vh - 112px);
  transition: all 0.2s;
  background: transparent;
`;

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
  };

  return (
    <StyledLayout>
      <Sidebar collapsed={collapsed} />
      <MainLayout>
        <Header collapsed={collapsed} onCollapse={handleCollapse} />
        <StyledContent style={{
          marginLeft: collapsed ? '96px' : '216px'
        }}>
          <Outlet />
        </StyledContent>
      </MainLayout>
    </StyledLayout>
  );
};
