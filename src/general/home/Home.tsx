import React, { useState } from 'react';
import { Layout, Divider, Typography, Button } from 'antd';
import { ConversationList } from './conversartion/ConversationList.tsx';
import { Chat } from './conversartion/Chat.tsx';
import { Profile } from './profile/Profile.tsx';
import { useHomeContext } from './context/HomeContext.tsx';

import useWebSocket from '../../hook/useWebSocket.ts';
import { useUser } from '../../context/UserContext.tsx';
import mapConversation from '../../utils/mapper/conversationMapper.ts';
import { FolderOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons/lib/components/Icon';

const { Sider, Content } = Layout;
const { Title } = Typography;

export function Home() {

    const { user } = useUser();
    const { handleConversationSelected, handleConversations, handleStompClient, selectedConversation } = useHomeContext();

    const [showArchived, setShowArchived] = useState<boolean>(false);

    const toggleView = () => {
        setShowArchived((prev) => !prev);
    };

    function handleCallbackConversation(data: any) {
        const conversationsMapped = data.map((conversation: any) => {
            return mapConversation(conversation, user.id);
        });

        handleConversations(conversationsMapped);

        if (selectedConversation.id) {
            const conversation = conversationsMapped.filter((conversation: any) => conversation.id === Number(selectedConversation.id))[0];
            const conversartionToUpdated = selectedConversation;

            if (conversation) {
                conversartionToUpdated.messages = conversation.messages;
                conversartionToUpdated.lastMessage = conversation.lastMessage;
            }

            handleConversationSelected(conversartionToUpdated);
        }
    };

    useWebSocket(handleCallbackConversation, handleStompClient, selectedConversation ? selectedConversation : null);

    return (
        <Layout>
            <Sider width={300} style={{ background: '#fff' }}>
                <Profile />
                <div className="button-folder">
                    <Button
                        icon={<FolderOutlined />}
                        type="default"
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            padding: '10px 0',
                            margin: '4px 0',
                            borderRadius: '8px',
                            backgroundColor: '#f0f0f0',
                            borderColor: '#d9d9d9',
                            color: '#1890ff',
                            fontWeight: 'bold',
                        }}
                        onClick={toggleView}
                    >
                        <Title level={5} style={{ margin: 0 }}>{showArchived ? 'Mostrar Conversas Ativas' : 'Mostrar Arquivadas'}</Title>
                    </Button>
                </div>
                {showArchived ? <FolderOutlined /> : <ConversationList />}
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
