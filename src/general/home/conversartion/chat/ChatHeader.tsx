import React from 'react';
import { Avatar, Typography } from 'antd';
import { byteArrayToDataUrl } from '../../../../utils/byteArrayToDataUrl.ts';

const { Title } = Typography;

interface ChatHeaderProps {
    profilePicture: string;
    conversationName: string;
}

export function ChatHeader({ profilePicture, conversationName }: ChatHeaderProps) {

    const imageUrl = byteArrayToDataUrl(profilePicture) || '';

    return (
        <div className='chat-header' style={{ marginBottom: '16px', display: 'flex', gap: 20 }}>
            <Avatar size={64} src={imageUrl} />
            <Title level={4} style={{ margin: '16px 0' }}>{conversationName}</Title>
        </div>
    );
}
