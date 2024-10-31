import { EllipsisOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, List, Menu, Space, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../../../context/UserContext';
import { useRequest } from '../../../../../../hook/useRequest';
import { HttpMethods } from '../../../../../../utils/IRequest';
import { Notification } from '../../../../../../utils/Notification';
import { WebSocketEventType } from '../../../../../../utils/enum/WebSocketEventType';
import { useHomeContext } from '../../../../context/HomeContext';

import './FriendList.css';
import { byteArrayToDataUrl } from '../../../../../../utils/functions/byteArrayToDataUrl';
import { ProfileModal } from '../../../../conversartion/chat/header/ProfileModal/ProfileModal';

export function FriendsListTab() {
    const { user } = useUser();
    const { request } = useRequest();
    const { handleModalStatus, doStartConversartion, stompClient, friendsList, setFriendsList, selectedConversation } = useHomeContext();

    const [selectedFriend, setSelectedFriend] = useState<any>(null);  // Guarda o amigo selecionado

    useEffect(() => {
        fetchFriends();
    }, [user?.id]);

    function fetchFriends() {
        request({
            method: HttpMethods.GET,
            url: '/user/find-friends?userId=' + user?.id,
            successCallback: (data) => {
                setFriendsList(data);
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    }

    function handleDeleteFriend(id: number) {
        const data = {
            action: WebSocketEventType.DELETE_FRIEND,
            friendshipDeleteRequestDTO: {
                friendId: id,
                userId: user?.id
            }
        };

        stompClient.send('/app/chat/' + user?.id, {}, JSON.stringify(data));
    }

    function handleStartConversartion(data) {
        data.senderId = user.id;

        doStartConversartion(data);
        handleModalStatus(false);
    }

    const menu = (friend: any) => (
        <Menu>
            <Menu.Item key="1" onClick={() => handleDeleteFriend(friend.id)}>
                Apagar Amizade
            </Menu.Item>
        </Menu>
    );

    return (
        <List
            dataSource={friendsList}
            renderItem={(friend: any) => (
                <List.Item className="list-item-container">
                    <Avatar
                        size={48}
                        icon={<UserOutlined />}
                        className="avatar"
                        onClick={() => setSelectedFriend(friend)}
                        src={friend?.profilePic?.length > 0 ? byteArrayToDataUrl(friend.profilePic) : ''}
                    />
                    {selectedFriend && (
                        <ProfileModal
                            user={{
                                profilePic: selectedFriend?.profilePic?.length > 0 ? byteArrayToDataUrl(selectedFriend.profilePic) : '',
                            }}
                            isModalVisible={selectedFriend?.id === friend.id}
                            handleCancel={() => setSelectedFriend(null)}
                            userInfo={{
                                conversationName: selectedFriend?.label,
                                createdDate: selectedFriend?.createdDate,
                                bio: selectedFriend?.bio
                            }}
                        />
                    )}
                    <List.Item.Meta
                        title={friend.label}
                        className='list-item-meta-friends'
                    />
                    <div className="actions-container">
                        <Tooltip title="Iniciar uma conversa">
                            <MessageOutlined className="message-icon" onClick={() => handleStartConversartion(friend)} />
                        </Tooltip>
                        <Dropdown overlay={menu(friend)} trigger={['click']}>
                            <Space>
                                <EllipsisOutlined className="dropdown-icon" />
                            </Space>
                        </Dropdown>
                    </div>
                </List.Item>
            )}
        />
    );
};
