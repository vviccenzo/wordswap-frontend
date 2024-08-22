import React from 'react';
import { Avatar, Dropdown, Menu, Space } from 'antd';
import { SettingOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useUser } from '../../../context/UserContext.tsx';
import { byteArrayToDataUrl } from '../../../utils/byteArrayToDataUrl.ts';
import { FriendshipRequestModal } from './FriendshipRequestModal.tsx';
import { useHomeContext } from '../context/HomeContext.tsx';

export function Profile() {

    const { user, doLogout } = useUser();
    const { handleModalStatus } = useHomeContext();

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
        <div style={{ padding: '16px', gap: 20, display: 'flex', justifyContent: 'space-between', backgroundColor: '#DCDCDC' }}>
            <Avatar
                size={64}
                src={hasProfilePicture ? imageUrl : undefined}
                icon={<UserOutlined />}
                style={{ cursor: 'pointer', border: '1px solid #777777' }}
            />
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
};