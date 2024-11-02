import { Layout, Typography, Card, Divider, List, Space } from 'antd';
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
const { Title, Text } = Typography;

export function Home() {
    const { user } = useUser();
    const { request } = useRequest();
    const { handleStompClient, selectedConversation, setFriendRequests } = useHomeContext();

    function fetchFriendRequests(userId) {
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
            <Layout className="layout-home">
                <Content className="content">
                    {selectedConversation ? (
                        <Chat />
                    ) : (
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', gap: '5px' }}>
                                <Title level={2} style={{ color: 'white', margin: 0 }}>Nenhuma</Title>
                                <Title level={2} style={{ color: '#A28BF6', margin: 0 }}>conversa</Title>
                                <Title level={2} style={{ color: 'white', margin: 0 }}>selecionada</Title>
                            </div>

                            <Divider style={{ borderColor: '#A28BF6', color: '#A28BF6' }}>Ajuda</Divider>

                            <List
                                dataSource={[
                                    {
                                        title: "Passo 1",
                                        description: "Acesse o botão Comunidade e vá até a aba Adicionar Amigo.",
                                    },
                                    {
                                        title: "Passo 2",
                                        description: "Você pode compartilhar o seu código de usuário para que seu amigo envie uma solicitação ou pegar o código de usuário do seu amigo e enviar uma solicitação diretamente.",
                                    },
                                    {
                                        title: "Passo 3",
                                        description: "Depois que seu amigo aceitar sua solicitação, vá até a lista de amigos e selecione 'Iniciar conversa' para começar a trocar mensagens.",
                                    },
                                ]}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<Text style={{ color: '#A28BF6' }}>{item.title}</Text>}
                                            description={<Text style={{ color: 'white' }}>{item.description}</Text>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Space>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
