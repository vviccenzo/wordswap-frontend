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
                    const conversationsMapped = data.map((conversation: any) => {
                        const combinedMessages = [
                            ...conversation.userMessages.map((msg: any) => ({
                                ...msg,
                                sender: msg.senderId === user.id ? 'me' : 'them'
                            })),
                            ...conversation.targetUserMessages.map((msg: any) => ({
                                ...msg,
                                sender: msg.senderId === user.id ? 'me' : 'them'
                            })),
                        ];

                        combinedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                        return {
                            id: conversation.id,
                            label: conversation.conversationName,
                            profilePic: conversation.profilePic,
                            messages: combinedMessages,
                            lastMessage: conversation.lastMessage,
                        };
                    });

                    handleConversations(conversationsMapped);
                },
                errorCallback: (error) => {
                    Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
                }
            });
        }
    }, [user.id]);

    const getLastMessage = (conv) => {
        const combinedMessages = [
            ...(conv.userMessages || []).map((msg: any) => ({
                ...msg,
                sender: msg.senderId === user.id ? 'me' : 'them'
            })),
            ...(conv.targetUserMessages || []).map((msg: any) => ({
                ...msg,
                sender: msg.senderId === user.id ? 'me' : 'them'
            })),
        ];

        combinedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const lastMessage = combinedMessages.length > 0 ? combinedMessages[combinedMessages.length - 1].content : '';

        return lastMessage ? lastMessage.text : '';
    };

    return (
        <div style={{ padding: '16px', height: '84.4%', display: 'flex', flexDirection: 'column', backgroundColor: '#DCDCDC' }}>
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
