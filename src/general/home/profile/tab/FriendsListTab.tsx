import React, { useEffect, useState } from 'react';
import { List, Dropdown, Space, Avatar, Menu } from 'antd';
import { EllipsisOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { useUser } from '../../../../context/UserContext.tsx';
import { HttpMethods } from '../../../../utils/IRequest.ts';
import { Notification } from '../../../../utils/Notification.tsx';
import { useRequest } from '../../../../hook/useRequest.ts';
import { useHomeContext } from '../../context/HomeContext.tsx';

export function FriendsListTab() {
    const { user } = useUser();
    const { request } = useRequest();

    const { handleModalStatus, doStartConversartion } = useHomeContext();

    const [friendsList, setFriendsList] = useState([]);

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
        request({
            method: HttpMethods.PUT,
            url: '/friendship/delete-friendship?friendId=' + id + '&userId=' + user?.id,
            successCallback: () => {
                fetchFriends();
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    }

    function handleStartConversartion(data) {
        data.senderId = user.id;

        doStartConversartion(data);
        handleModalStatus(false);
    }

    const menu = (item: any) => (
        <Menu>
            <Menu.Item key="1" onClick={() => handleDeleteFriend(item.id)}>
                Apagar Amizade
            </Menu.Item>
        </Menu>
    );

    return (
        <List
            dataSource={friendsList}
            renderItem={(item: any) => (
                <List.Item>
                    <Avatar
                        size={48}
                        icon={<UserOutlined />}
                        style={{ cursor: 'pointer', border: '1px solid #777777', marginRight: 10 }}
                    />
                    <List.Item.Meta
                        title={item.label}
                    />
                    <div style={{ gap: 20, display: 'flex' }}>
                        <MessageOutlined style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => handleStartConversartion(item)} />
                        <Dropdown overlay={menu(item)} trigger={['click']}>
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
