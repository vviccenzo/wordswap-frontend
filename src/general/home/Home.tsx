import React from 'react';
import { Layout, Divider, Typography } from 'antd';
import { ConversationList } from './conversartion/ConversationList.tsx';
import { Chat } from './conversartion/Chat.tsx';
import { Profile } from './profile/Profile.tsx';
import { useHomeContext } from './context/HomeContext.tsx';

import useWebSocket from '../../hook/useWebSocket.ts';
import { useUser } from '../../context/UserContext.tsx';
import mapConversation from '../../utils/mapper/conversationMapper.ts';

const { Sider, Content } = Layout;
const { Title } = Typography;

export function Home() {

    const { user } = useUser();
    const { handleConversationSelected, handleConversations, handleStompClient, selectedConversation } = useHomeContext();

    function handleCallbackConversation(data: any) {
        const conversationsMapped = data.map((conversation: any) => {
            return mapConversation(conversation, user.id);
        });

        handleConversations(conversationsMapped);

        if (selectedConversation.id) {
            handleConversationSelected(
                conversationsMapped.filter((conversation: any) => conversation.id === Number(selectedConversation.id))[0]
            )
        }
    };

    useWebSocket(handleCallbackConversation, handleStompClient, selectedConversation ? selectedConversation : null);

    return (
        <Layout>
            <Sider width={300} style={{ background: '#fff' }}>
                <Profile />
                <Divider style={{ backgroundColor: 'white' }} />
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
                    {selectedConversation ? (
                        <Chat />
                    ) : (
                        <Title level={2}>Select a conversation</Title>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
