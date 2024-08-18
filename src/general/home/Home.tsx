import React from 'react';
import { Layout, Divider, Typography } from 'antd';
import { ConversationList } from './conversartion/ConversationList.tsx';
import { Chat } from './conversartion/Chat.tsx';
import { Profile } from './profile/Profile.tsx';
import { useHomeContext } from './context/HomeContext.tsx';

const { Sider, Content } = Layout;
const { Title } = Typography;

export function Home() {

    const { selectedConversation, handleConversationSelected } = useHomeContext();

    const handleSendMessage = (messageContent) => {
        if (selectedConversation) {
            const newMessage = {
                id: selectedConversation.messages.length + 1,
                sender: 'me',
                content: messageContent,
            };

            const updatedConversation = {
                ...selectedConversation,
                messages: [...selectedConversation.messages, newMessage],
            };

            handleConversationSelected(updatedConversation);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={300} style={{ background: '#fff' }}>
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
                    {selectedConversation ? (
                        <Chat
                            conversation={selectedConversation}
                            onSendMessage={handleSendMessage}
                        />
                    ) : (
                        <Title level={2}>Select a conversation</Title>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
