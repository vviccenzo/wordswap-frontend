import { Avatar, Typography } from 'antd';
import React, { useState } from 'react';
import { byteArrayToDataUrl } from '../../../../../utils/functions/byteArrayToDataUrl';
import { ChatHeaderProps } from '../IChat';
import './ChatHeader.css';
import { ProfileModal } from './ProfileModal/ProfileModal';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

export function ChatHeader({ profilePicture, conversationName, selectedConversation }: ChatHeaderProps) {

    const imageUrl = profilePicture !== "" ? byteArrayToDataUrl(profilePicture) : '';
    const [isModalUserVisible, setIsModalUserVisible] = useState<boolean>(false);

    return (
        <div className="chat-header">
            {imageUrl && imageUrl.length > 0 ?
                <Avatar
                    style={{ cursor: 'pointer' }}
                    size={52}
                    src={imageUrl}
                    onClick={() => setIsModalUserVisible(true)}
                />
                :
                <Avatar
                    style={{ cursor: 'pointer' }}
                    size={52}
                    icon={<UserOutlined />}
                    onClick={() => setIsModalUserVisible(true)}
                />
            }
            <Title level={4} className="conversation-name">{conversationName}</Title>
            <ProfileModal
                user={{
                    selectedConversation,
                    profilePic: imageUrl,
                }}
                isModalVisible={isModalUserVisible}
                handleCancel={() => setIsModalUserVisible(false)}
                userInfo={{
                    conversationName: conversationName,
                    createdDate: selectedConversation?.userInfo?.createdDate,
                    profilePic: selectedConversation?.userInfo?.profilePic
                }}
            />
        </div>
    );
}
