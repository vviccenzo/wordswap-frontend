import React from 'react';
import { List, Typography } from 'antd';

const { Text } = Typography;

export function Message({ message, isMe }) {
    return (
        <List.Item
            style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                marginBottom: '8px',
            }}
        >
            <div
                style={{
                    background: isMe ? '#dcf8c6' : '#fff',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    maxWidth: '60%',
                    wordBreak: 'break-word',
                    position: 'relative',
                }}
            >
                <Text>{message.content}</Text>
                <div
                    style={{
                        fontSize: '12px',
                        color: '#888',
                        position: 'absolute',
                        bottom: '4px',
                        right: '8px',
                    }}
                >
                    {message.timestamp}
                </div>
            </div>
        </List.Item>
    );
}
