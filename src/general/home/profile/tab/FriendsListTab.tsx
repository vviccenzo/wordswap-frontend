import React, { useEffect, useState } from 'react';
import { List, Dropdown, Space, Avatar, Menu } from 'antd';
import { EllipsisOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { useUser } from '../../../../context/UserContext.tsx';
import { HttpMethods } from '../../../../utils/IRequest.ts';
import { Notification } from '../../../../utils/Notification.tsx';
import { useRequest } from '../../../../hook/useRequest.ts';
import { useHomeContext } from '../../context/HomeContext.tsx';
import { WebSocketEventType } from '../../../../utils/enum/WebSocketEventType.ts';

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
                <List.Item>
                    <Avatar
                        size={48}
                        icon={<UserOutlined />}
                        style={{ cursor: 'pointer', border: '1px solid #777777', marginRight: 10 }}
                    />
                    <List.Item.Meta
                        title={friend.label}
                    />
                    <div style={{ gap: 20, display: 'flex' }}>
                        <MessageOutlined style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => handleStartConversartion(friend)} />
                        <Dropdown overlay={menu(friend)} trigger={['click']}>
                            <Space>
                                <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                            </Space>
                        </Dropdown>
                    </div>
                </List.Item>
            )}
        />
    );
};
