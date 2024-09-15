import { EllipsisOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, List, Menu, Space } from 'antd';
import React, { useEffect } from 'react';
import { useUser } from '../../../../../../context/UserContext.tsx';
import { useRequest } from '../../../../../../hook/useRequest.ts';
import { HttpMethods } from '../../../../../../utils/IRequest.ts';
import { Notification } from '../../../../../../utils/Notification.tsx';
import { WebSocketEventType } from '../../../../../../utils/enum/WebSocketEventType.ts';
import { useHomeContext } from '../../../../context/HomeContext.tsx';

import './FriendList.css';

export function FriendsListTab() {
    const { user } = useUser();
    const { request } = useRequest();
    const { handleModalStatus, doStartConversartion, stompClient, friendsList, setFriendsList } = useHomeContext();

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
                    />
                    <List.Item.Meta
                        title={friend.label}
                    />
                    <div className="actions-container">
                        <MessageOutlined className="message-icon" onClick={() => handleStartConversartion(friend)} />
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
