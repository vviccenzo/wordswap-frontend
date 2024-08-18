import React, { useEffect } from 'react';
import { Menu, Typography } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useHomeContext } from '../context/HomeContext.tsx';
import { useUser } from '../../../context/UserContext.tsx';
import { HttpMethods } from '../../../utils/IRequest.ts';
import { Notification } from '../../../utils/Notification.tsx';
import { useRequest } from '../../../hook/useRequest.ts';

const { Title, Text } = Typography;

export function ConversationList() {

    const { request } = useRequest();
    const { user } = useUser();

    const { conversations, handleConversations, handleConversationSelected } = useHomeContext();

    useEffect(() => {
        if (user.id) {
            request({
                method: HttpMethods.GET,
                url: '/conversation/load-conversations?userId=' + user.id,
                successCallback: (data) => {
                    handleConversations(data);
                },
                errorCallback: (error) => {
                    Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
                }
            });
        }
    }, [user.id]);

    const getLastMessage = (conv) => {
        const allMessages = [
            ...conv.userMessages,
            ...conv.targetUserMessages,
        ];

        allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const lastMessage = allMessages[allMessages.length - 1];

        return lastMessage ? lastMessage.text : '';
    };

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
                        <Title level={5} style={{ margin: 0 }}>{conv.conversationName}</Title>
                        <Text type="secondary">{getLastMessage(conv)}</Text>
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};
