import { DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Typography } from 'antd';
import React, { useEffect } from 'react';

import { useRequest } from '../../../hook/useRequest';
import { byteArrayToDataUrl } from '../../../utils/functions/byteArrayToDataUrl';
import { HttpMethods } from '../../../utils/IRequest';
import { Notification } from '../../../utils/Notification';
import { useHomeContext } from '../context/HomeContext';
import mapConversations from '../../../utils/mapper/conversationMapper';

import { useUser } from '../../../context/UserContext';
import moment from 'moment';

import './ConversationList.css';

const { Title, Text } = Typography;

export function ConversationList({ showArchived }) {
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
                setLoading(false);
                handleConversations(data.map((conversation: any) => mapConversations(conversation, user.id)));
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    }

    function handleArchive(conv, hasToArchive) {
        request({
            method: HttpMethods.PUT,
            url: '/conversation/archive-conversation',
            data: {
                userId: user.id,
                id: conv.id,
                hasToArchive: hasToArchive
            }
        });

        fetchConversations();
    }

    const handleMenuClick = (e, conv) => {
        if (e.key === 'delete') {
            handleDelete(conv);
        } else if (e.key === 'archive') {
            handleArchive(conv, true);
        } else if (e.key === 'unarchive') {
            handleArchive(conv, false);
        }
    };

    const menu = (conv) => (
        <Menu onClick={(e) => handleMenuClick(e, conv)}>
            <Menu.Item key="delete" icon={<DeleteOutlined />}>
                Deletar Conversa
            </Menu.Item>
            {verifyIfIsArchived(conv) ?
                <Menu.Item key="unarchive" icon={<FolderOutlined />}>
                    Desarquivar Conversa
                </Menu.Item>
                :
                <Menu.Item key="archive" icon={<FolderOutlined />}>
                    Arquivar Conversa
                </Menu.Item>
            }
        </Menu>
    );

    function verifyIfIsArchived(conv) {
        if (conv.isArchivedInitiator || conv.isArchivedRecipient) {
            return true;
        }

        return false;
    }

    return (
        <div className="container">
            <Menu mode="inline" theme="dark" className="menu">
                {conversations.filter((conv: any) => {
                    const isUserInitiator = conv.senderId === user.id;
                    const isUserReceiver = conv.receiverId === user.id;

                    if (showArchived) {
                        if (isUserInitiator) {
                            return conv.isArchivedInitiator;
                        }

                        if (isUserReceiver) {
                            return conv.isArchivedRecipient;
                        }
                    } else {
                        if (isUserInitiator) {
                            return !conv.isArchivedInitiator;
                        }

                        if (isUserReceiver) {
                            return !conv.isArchivedRecipient;
                        }
                    }

                    return true;
                }).map((conv) => (
                    <Menu.Item
                        key={conv.id}
                        icon={
                            <Avatar
                                size={48}
                                className="avatar-conversation"
                                src={conv.profilePic ? byteArrayToDataUrl(conv.profilePic) : null}
                            />
                        }
                        onClick={() => {
                            setScrollPage(1);
                            setTotalMessages(conv.totalMessages || 0);
                            handleConversationSelected(conv);
                        }}
                        className="menu-item"
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <Dropdown
                            menu={conv}
                            trigger={['contextMenu']}
                        >
                            <div className="menu-title-content">
                                <div className="title-row">
                                    <Title level={5} className="title-conversation">{conv.conversationName}</Title>
                                    <Text type="secondary" className="last-message-time">{getLastTimeMessage(conv)}</Text>
                                </div>
                                <Text type="secondary" className="last-message">{getLastMessage(conv)}</Text>
                            </div>
                        </Dropdown>
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};