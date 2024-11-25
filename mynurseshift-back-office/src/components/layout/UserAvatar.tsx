import React from 'react';
import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  cursor: pointer;
  min-width: 180px;
`;

const StyledAvatar = styled(Avatar)`
  background: #1890ff;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #262626;
  font-size: 14px;
`;

export const UserAvatar: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Administrateur';
      case 'ADMIN':
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };

  const getName = () => {
    return user?.firstName || getRoleName(user?.role || '');
  };

  const menuItems = [
    {
      key: 'logout',
      label: 'Déconnexion',
      icon: <LogoutOutlined />,
      onClick: logout,
      danger: true,
    }
  ];

  if (!user) return null;

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
      <UserContainer>
        <StyledAvatar size={32} icon={<UserOutlined />} />
        <UserInfo>
          <UserName>{getName()}</UserName>
        </UserInfo>
      </UserContainer>
    </Dropdown>
  );
};
