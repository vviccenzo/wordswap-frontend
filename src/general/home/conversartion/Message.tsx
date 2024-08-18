// src/components/Message.jsx
import React from 'react';
import { List, Typography } from 'antd';

const { Text } = Typography;

export function Message({ message, isMe }) {
    return (
        <List.Item
            style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
            }}
        >
            <div
                style={{
                    background: isMe ? '#dcf8c6' : '#fff',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    maxWidth: '60%',
                    wordBreak: 'break-word',
                }}
            >
                <Text>{message.content}</Text>
            </div>
        </List.Item>
    );
};
