import { DeleteOutlined, FolderOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { useRequest } from '../../../hook/useRequest';
import { byteArrayToDataUrl } from '../../../utils/functions/byteArrayToDataUrl';
import { HttpMethods } from '../../../utils/IRequest';
import mapConversations from '../../../utils/mapper/conversationMapper';
import { Notification } from '../../../utils/Notification';
import { useHomeContext } from '../context/HomeContext';

import moment from 'moment';
import { useUser } from '../../../context/UserContext';

import './ConversationList.css';
import InviteModal from '../groupModal/InviteModal';

const { Title, Text } = Typography;

export function ConversationList() {
    const { user } = useUser();
    const { request } = useRequest();
    const { conversations, handleConversations, handleConversationSelected, setLoading, scrollPage, setScrollPage, setTotalMessages, selectedConversation } = useHomeContext();

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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

    const handleMenuClick = (e, conv) => {
        if (e.key === 'delete') {
            handleDelete(conv);
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

    function showInviteModal() {
        setIsModalVisible(true);
    };

    function handleCloseModal() {
        setIsModalVisible(false);
    };

    return (
        <>
            <div style={{
                marginLeft: '15px',
                marginRight: '15px',
                marginTop: '10px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#A28BF6',
            }}>
                <span style={{
                    marginTop: '5px',
                    marginBottom: '5px',
                    marginLeft: '10px',
                    color: 'black',
                    fontSize: '20px',
                    fontFamily: 'sans-serif',
                }}>
                    Conversas
                </span>
                <UsergroupAddOutlined
                    style={{
                        marginRight: '10px',
                        color: 'black',
                        fontSize: '20px',
                    }}
                    onClick={showInviteModal} />
                <InviteModal
                    visible={isModalVisible}
                    onClose={handleCloseModal}
                />
            </div>
            <div className="container">
                <Menu mode="inline" theme="dark" className="menu">
                    {conversations.filter((conv: any) => {
                        const isUserInitiator = conv.senderId === user.id;
                        const isUserReceiver = conv.receiverId === user.id;

                        if (isUserInitiator) {
                            return !conv.isArchivedInitiator;
                        }

                        if (isUserReceiver) {
                            return !conv.isArchivedRecipient;
                        }

                        return true;
                    }).map((conv) => (
                        <Menu.Item
                            key={conv.id}
                            icon={
                                conv.profilePic ? (
                                    <Avatar
                                        size={48}
                                        className="avatar-conversation"
                                        src={byteArrayToDataUrl(conv.profilePic)}
                                    />
                                ) : (
                                    <Avatar
                                        size={48}
                                        className="avatar-conversation"
                                        icon={<UserOutlined />}
                                    />
                                )
                            }
                            onClick={() => {
                                if (conv.id !== selectedConversation?.id) {
                                    setScrollPage(1);
                                    setTotalMessages(0);
                                    handleConversationSelected(conv);
                                } else {
                                    setScrollPage(0);
                                    setTotalMessages(0);
                                    handleConversationSelected(null);
                                }
                            }}
                            className="menu-item"
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <Dropdown
                                overlay={menu(conv)}
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
        </>
    );
};