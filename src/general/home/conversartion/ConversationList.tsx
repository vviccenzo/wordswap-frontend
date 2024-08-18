// src/components/ConversationList.jsx
import React from 'react';
import { Menu, Typography } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useHomeContext } from '../context/HomeContext.tsx';

const { Title, Text } = Typography;

export function ConversationList() {

    const { conversations, handleConversationSelected } = useHomeContext();

    return (
        <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#DCDCDC' }}>
            <Menu mode="inline" theme="light" style={{ borderRadius: 10 }}>
                {conversations.map((conv) => (
                    <Menu.Item
                        key={conv.id}
                        icon={<MessageOutlined />}
                        onClick={() => handleConversationSelected(conv)}
                        style={{ height: 70, padding: '0 24px' }}
                    >
                        <Title level={5} style={{ margin: 0 }}>{conv.name}</Title>
                        <Text type="secondary">{conv.messages[conv.messages.length - 1]?.content || ''}</Text>
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};
