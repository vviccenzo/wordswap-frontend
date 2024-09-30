import React, { useState } from 'react';
import { Avatar, Badge, Dropdown, Menu, Space } from 'antd';
import { SettingOutlined, TeamOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { useUser } from '../../../context/UserContext.tsx';
import { byteArrayToDataUrl } from '../../../utils/functions/byteArrayToDataUrl.ts';
import { FriendshipRequestModal } from './friendshipRequest/FriendshipRequestModal.tsx';
import { useHomeContext } from '../context/HomeContext.tsx';
import { EditUserModal } from './editUser/EditUserModal.tsx';

import './Profile.css';

export function Profile() {
    const { user, doLogout } = useUser();
    const { handleModalStatus, handleEditModalStatus, friendRequests } = useHomeContext();
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
        <div className="profile-container">
            <div
                className="avatar-container"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <Avatar
                    size={64}
                    src={hasProfilePicture ? imageUrl : undefined}
                    icon={isHovering ? <EditOutlined /> : <UserOutlined />}
                    className={`avatar ${isHovering ? 'avatar-hover' : ''}`}
                    onClick={isHovering ? () => handleEditModalStatus(true) : undefined}
                />
                <EditUserModal />
            </div>
            <div className="space">
                <div className="badge-container">
                    <Badge count={friendRequests.length} overflowCount={99} offset={[10, 0]}>
                        <TeamOutlined className="icon" onClick={() => handleModalStatus(true)} />
                    </Badge>
                </div>

                <FriendshipRequestModal />
                <Dropdown overlay={menu} trigger={['click']}>
                    <Space>
                        <SettingOutlined className="dropdown-icon" />
                    </Space>
                </Dropdown>
            </div>
        </div>
    );
}
