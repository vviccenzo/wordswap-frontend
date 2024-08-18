// src/components/Chat.jsx
import React, { useState } from 'react';
import { Input, List, Avatar, Typography, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Message } from './Message.tsx';

const { Title } = Typography;

export function Chat({ conversation, onSendMessage }) {
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const filteredMessages = conversation.messages.filter((msg) =>
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px', display: 'flex', gap: 20 }}>
                <Avatar size={64} src={conversation.profilePicture} />
                <Title level={4} style={{ margin: '16px 0' }}>{conversation.name}</Title>
            </div>
            <div style={{ flex: 1, overflowY: 'scroll', marginBottom: '16px' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={filteredMessages}
                    renderItem={(msg: any) => (
                        <Message
                            message={{
                                content: msg.content,
                                avatar: msg.sender === 'me' ? null : conversation.profilePicture,
                                senderName: msg.sender === 'me' ? 'You' : conversation.name,
                            }}
                            isMe={msg.sender === 'me'}
                        />
                    )}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onPressEnter={handleSend}
                    style={{ marginRight: '8px' }}
                />
                <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
                    Send
                </Button>
            </div>
        </div>
    );
};
