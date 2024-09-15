import { Avatar, Typography } from 'antd';
import React from 'react';
import { byteArrayToDataUrl } from '../../../../../utils/functions/byteArrayToDataUrl.ts';
import { ChatHeaderProps } from '../IChat.ts';
import './ChatHeader.css';

const { Title } = Typography;

export function ChatHeader({ profilePicture, conversationName }: ChatHeaderProps) {

    const imageUrl = byteArrayToDataUrl(profilePicture) || '';

    return (
        <div className="chat-header">
            <Avatar size={52} src={imageUrl} />
            <Title level={4} className="conversation-name">{conversationName}</Title>
        </div>
    );
}
