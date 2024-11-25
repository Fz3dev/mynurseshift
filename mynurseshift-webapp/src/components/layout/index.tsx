import React, { useState } from 'react';
import { Layout as AntLayout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const { Header, Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
`;

const StyledContent = styled(Content)`
  margin: 88px 24px 24px;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  min-height: auto;
`;

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <StyledLayout>
      <Sidebar collapsed={collapsed} />
      <AntLayout>
        <StyledHeader>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        </StyledHeader>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </AntLayout>
    </StyledLayout>
  );
};
