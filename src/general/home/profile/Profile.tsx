import React from 'react';
import { Avatar } from 'antd';
import { SettingOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useUser } from '../../../context/UserContext.tsx';
import { byteArrayToDataUrl } from '../../../utils/byteArrayToDataUrl.ts';
import { FriendshipRequestModal } from './FriendshipRequestModal.tsx';

export function Profile() {

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { user } = useUser();

    const hasProfilePicture = user?.profilePic && user?.profilePic?.length > 0;
    const imageUrl = hasProfilePicture ? byteArrayToDataUrl(user.profilePic) : '';

    return (
        <div style={{ padding: '16px', gap: 20, display: 'flex', justifyContent: 'space-between', backgroundColor: '#DCDCDC' }}>
            <Avatar
                size={64}
                src={hasProfilePicture ? imageUrl : undefined}
                icon={<UserOutlined />}
                style={{ cursor: 'pointer', border: '1px solid #777777' }}
            />
            <div style={{ display: 'flex', gap: 35, marginRight: 10 }}>
                <TeamOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => setIsModalOpen(true)} />
                <FriendshipRequestModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                <SettingOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </div>
        </div>
    );
};