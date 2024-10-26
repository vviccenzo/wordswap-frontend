import { Layout, Typography } from 'antd';
import { useEffect } from 'react';

import { useUser } from '../../context/UserContext';
import { useRequest } from '../../hook/useRequest';
import useWebSocket from '../../hook/useWebSocket';
import { HttpMethods } from '../../utils/IRequest';
import { Notification } from '../../utils/Notification';
import { useHomeContext } from './context/HomeContext';
import { Chat } from './conversartion/chat/Chat';
import { ConversationList } from './conversartion/ConversationList';
import { Profile } from './profile/Profile';

import Paragraph from 'antd/es/typography/Paragraph';
import './Home.css';

const { Sider, Content } = Layout;
const { Title } = Typography;

export function Home() {
    const { user } = useUser();
    const { request } = useRequest();
    const { handleStompClient, selectedConversation, setFriendRequests } = useHomeContext();

    function fetchFriendRequests(userId: number) {
        request({
            method: HttpMethods.GET,
            url: '/friendship/find-pending-invites?userId=' + userId,
            successCallback: (data) => {
                setFriendRequests(data);
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    }

    useEffect(() => {
        if (user.id) {
            fetchFriendRequests(user.id);
        }
    }, [user?.id]);

    useWebSocket(handleStompClient);

    return (
        <Layout>
            <Sider width={300} className="sider">
                <div className="profile"><Profile /></div>
                <ConversationList />
            </Sider>
            <Layout className='layout-home'>
                <Content className="content">
                    {selectedConversation ? (
                        <Chat />
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <Title level={2} style={{ color: 'white', margin: 0 }}>Nenhuma</Title>
                                <Title level={2} style={{ color: '#A28BF6', margin: 0 }}>conversa</Title>
                                <Title level={2} style={{ color: 'white', margin: 0 }}>selecionada</Title>
                            </div>
                            <Paragraph style={{ color: 'white' }}>
                                Por favor, selecione uma conversa ou inicie uma nova para começar a trocar mensagens.
                            </Paragraph>
                        </>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
