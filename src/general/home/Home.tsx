import React from 'react';
import { Layout, Divider, Typography } from 'antd';
import { ConversationList } from './conversartion/ConversationList.tsx';
import { Chat } from './conversartion/Chat.tsx';
import { Profile } from './profile/Profile.tsx';
import { useHomeContext } from './context/HomeContext.tsx';

import useWebSocket from '../../hook/useWebSocket.ts';
import { useUser } from '../../context/UserContext.tsx';

const { Sider, Content } = Layout;
const { Title } = Typography;

export function Home() {

    const { user } = useUser();
    const { handleConversationSelected, handleConversations, handleStompClient } = useHomeContext();
    const selectedConversationId = localStorage.getItem('conversationId');

    function handleCallbackConversation(data: any) {
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

        if (selectedConversationId) {
            handleConversationSelected(
                conversationsMapped.filter((conversation: any) => conversation.id === Number(selectedConversationId))[0]
            )
        }
    };

    useWebSocket(handleCallbackConversation, handleStompClient, Number(selectedConversationId));

    return (
        <Layout>
            <Sider width={300} style={{ background: 'black' }}>
                <Profile />
                <Divider />
                <ConversationList />
            </Sider>
            <Layout style={{ padding: '0 24px', minHeight: '100vh' }}>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: '#fff',
                    }}
                >
                    {selectedConversationId ? (
                        <Chat />
                    ) : (
                        <Title level={2}>Select a conversation</Title>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
