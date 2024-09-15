import { Button, Layout, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHomeContext } from './context/HomeContext.tsx';
import { Chat } from './conversartion/chat/Chat.tsx';
import { ConversationList } from './conversartion/ConversationList.tsx';
import { Profile } from './profile/Profile.tsx';
import { FolderOutlined } from '@ant-design/icons';
import useWebSocket from '../../hook/useWebSocket.ts';
import { useUser } from '../../context/UserContext.tsx';
import { useRequest } from '../../hook/useRequest.ts';
import { HttpMethods } from '../../utils/IRequest.ts';
import { Notification } from '../../utils/Notification.tsx';

import './Home.css';

const { Sider, Content } = Layout;
const { Title } = Typography;

export function Home() {
    const { user } = useUser();
    const { request } = useRequest();
    const { handleStompClient, selectedConversation, setFriendRequests } = useHomeContext();
    const [showArchived, setShowArchived] = useState<boolean>(false);

    const toggleView = () => {
        setShowArchived((prev) => !prev);
    };

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
                {/* <div className="button-folder">
                    <Button
                        icon={<FolderOutlined className='folder-icon'/>}
                        type="default"
                        className="folder-button"
                        onClick={toggleView}
                    >
                        <Title className="title-folder" level={5}>{showArchived ? 'Mostrar Conversas Ativas' : 'Mostrar Arquivadas'}</Title>
                    </Button>
                </div> */}
                {showArchived ? <FolderOutlined /> : <ConversationList />}
            </Sider>
            <Layout className='layout-home'>
                <Content className="content">
                    {selectedConversation ? (
                        <Chat />
                    ) : (
                        <Title level={2}>Inicie uma conversa</Title>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
