import React from 'react';
import { Avatar } from 'antd';
import { SettingOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

export function Profile({ profileData }) {
    return (
        <div style={{ padding: '16px', gap: 20, display: 'flex', justifyContent: 'space-between', backgroundColor: '#DCDCDC' }}>
            <Avatar size={64} src={profileData.profilePicture} icon={<UserOutlined />} style={{ cursor: 'pointer', border: '1px solid #777777' }}/>
            <div style={{ display: 'flex', gap: 35, marginRight: 10 }}>
                <TeamOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
                <SettingOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </div>
        </div>
    );
};