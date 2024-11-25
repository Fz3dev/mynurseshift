import React from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { UserAvatar } from './UserAvatar';

const { Header: AntHeader } = Layout;

const StyledHeader = styled(AntHeader)`
  background: white;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  height: 64px;
  width: 100%;
  position: fixed;
  z-index: 100;
  transition: all 0.2s;
`;

const MenuButton = styled(Button)`
  width: 64px;
  height: 64px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  &:hover, &:focus {
    color: #1890ff;
    background: transparent;
  }

  &:focus {
    outline: none;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-right: 24px;
`;

interface HeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, onCollapse }) => {
  return (
    <StyledHeader style={{ 
      left: collapsed ? 80 : 200,
      width: `calc(100% - ${collapsed ? 80 : 200}px)`
    }}>
      <MenuButton
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => onCollapse(!collapsed)}
      />
      <HeaderRight>
        <UserAvatar />
      </HeaderRight>
    </StyledHeader>
  );
};
