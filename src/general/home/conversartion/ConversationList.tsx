import { DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useUser } from '../../../context/UserContext.tsx';
import { useRequest } from '../../../hook/useRequest.ts';
import { byteArrayToDataUrl } from '../../../utils/functions/byteArrayToDataUrl.ts';
import { HttpMethods } from '../../../utils/IRequest.ts';
import { Notification } from '../../../utils/Notification.tsx';
import { useHomeContext } from '../context/HomeContext.tsx';

import * as moment from 'moment';
import mapConversations from '../../../utils/mapper/conversationMapper.ts';

const { Title, Text } = Typography;

export function ConversationList() {

    const { user } = useUser();
    const { request } = useRequest();

    const { conversations, handleConversations, handleConversationSelected, setLoading, scrollPage, setScrollPage, setTotalMessages } = useHomeContext();

    useEffect(() => {
        if (user.id) {
            fetchConversations();
        }
    }, [user.id]);

    const getLastMessage = (conv) => {
        if (conv && conv.lastMessage && Object.keys(conv.lastMessage).length > 0) {
            const firstKey = Object.keys(conv.lastMessage)[0];
            return conv.lastMessage[firstKey];
        }

        return '';
    };

    const getLastTimeMessage = (conv) => {
        if (conv && conv.lastMessage && Object.keys(conv.lastMessage).length > 0) {
            const timeMessage = Object.keys(conv.lastMessage)[0];

            return moment(timeMessage).format('HH:mm');
        }

        return '';
    };

    function handleDelete(conv) {
        const data = {
            userId: user.id,
            id: conv.id
        }

        request({
            method: HttpMethods.POST,
            url: '/conversation/delete-conversation',
            data: data,
            successCallback: (data) => {
                fetchConversations();
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    }

    function fetchConversations() {
        request({
            method: HttpMethods.GET,
            url: '/conversation/load-conversations?userId=' + user.id + '&pageNumber=' + scrollPage,
            successCallback: (data) => {
                const conversationsMapped: any[] = data.map((conversation: any) => {
                    return mapConversations(conversation, user.id);
                })

                setLoading(false);
                handleConversations(conversationsMapped);
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    }

    function handleArchive(conv) {
        console.log(conv);
    }

    const handleMenuClick = (e, conv) => {
        if (e.key === 'delete') {
            handleDelete(conv);
        } else if (e.key === 'archive') {
            handleArchive(conv);
        }
    };

    const menu = (conv) => (
        <Menu onClick={(e) => handleMenuClick(e, conv)}>
            <Menu.Item key="delete" icon={<DeleteOutlined />}>
                Deletar Conversa
            </Menu.Item>
            <Menu.Item key="archive" icon={<FolderOutlined />}>
                Arquivar Conversa
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ padding: '16px', height: '84.4%', display: 'flex', flexDirection: 'column' }}>
            <Menu mode="inline" theme="light" style={{ borderRadius: 10 }}>
                {conversations.map((conv) => (
                    <Menu.Item
                        key={conv.id}
                        icon={
                            <Avatar
                                size={48}
                                style={{
                                    border: '1px solid #777777',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden'
                                }}
                                src={byteArrayToDataUrl(conv.profilePic) || ''}
                            />
                        }
                        onClick={() => {
                            setScrollPage(1);
                            setTotalMessages(conv.totalMessages || 0);
                            handleConversationSelected(conv);
                        }}
                        style={{ height: 55, paddingLeft: 20, marginBottom: 10 }}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <Dropdown
                            overlay={menu(conv)}
                            trigger={['contextMenu']}
                        >
                            <div className="ant-menu-title-content" style={{ display: 'flex', flexDirection: 'column', gap: 5, marginLeft: 5 }}>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Title level={5} style={{ margin: 0 }}>{conv.conversationName}</Title>
                                    <Text type="secondary" style={{ fontSize: 11, marginTop: 4, marginLeft: 5, fontWeight: 'bold' }}>{getLastTimeMessage(conv)}</Text>
                                </div>
                                <Text type="secondary">{getLastMessage(conv)}</Text>
                            </div>
                        </Dropdown>
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};
