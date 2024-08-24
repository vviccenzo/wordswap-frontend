import React, { useState } from 'react';
import { Avatar, Dropdown, Menu, Space, Typography } from 'antd';
import { SettingOutlined, TeamOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { useUser } from '../../../context/UserContext.tsx';
import { byteArrayToDataUrl } from '../../../utils/byteArrayToDataUrl.ts';
import { FriendshipRequestModal } from './FriendshipRequestModal.tsx';
import { useHomeContext } from '../context/HomeContext.tsx';
import { EditUserModal } from './editUser/EditUserModal.tsx';

export function Profile() {
    const { user, doLogout } = useUser();
    const { handleModalStatus, handleEditModalStatus } = useHomeContext();
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const hasProfilePicture = user?.profilePic && user?.profilePic?.length > 0;
    const imageUrl = hasProfilePicture ? byteArrayToDataUrl(user.profilePic) : '';

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            doLogout();
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="settings">Configurações</Menu.Item>
            <Menu.Item key="logout">Deslogar</Menu.Item>
        </Menu>
    );

    return (
        <div style={{ padding: '16px', gap: 20, display: 'flex', justifyContent: 'space-between', backgroundColor: '#DCDCDC', position: 'relative' }}>
            <div
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }} // Alinhando avatar e nome na horizontal
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <Avatar
                    size={64}
                    src={hasProfilePicture ? imageUrl : undefined}
                    icon={isHovering ? <EditOutlined /> : <UserOutlined />}
                    style={{
                        cursor: 'pointer',
                        border: '1px solid #777777',
                        opacity: isHovering ? 0.8 : 1,
                        transition: 'opacity 0.3s',
                        marginRight: '8px'
                    }}
                    onClick={isHovering ? () => handleEditModalStatus(true) : undefined}
                />
                <span style={{ color: '#777777', fontSize: '14px', opacity: 0.7 }}>{user.name}</span>
                <EditUserModal />
            </div>
            <div style={{ display: 'flex', gap: 35, marginRight: 10 }}>
                <TeamOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => handleModalStatus(true)} />
                <FriendshipRequestModal />
                <Dropdown overlay={menu} trigger={['click']}>
                    <Space>
                        <SettingOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
                    </Space>
                </Dropdown>
            </div>
        </div>
    );
}
