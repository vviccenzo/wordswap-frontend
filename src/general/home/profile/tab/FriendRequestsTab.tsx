import React, { useEffect, useState } from 'react';
import { List, Button, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useRequest } from '../../../../hook/useRequest.ts';
import { HttpMethods } from '../../../../utils/IRequest.ts';
import { useUser } from '../../../../context/UserContext.tsx';
import { Notification } from '../../../../utils/Notification.tsx';

export const FriendRequestsTab: React.FC = () => {
    const { user } = useUser();
    const { request } = useRequest();
    const [friendRequests, setFriendRequests] = useState<any>([]);

    useEffect(() => {
        fetchFriendRequests();
    }, [user?.id]);

    function fetchFriendRequests() {
        request({
            method: HttpMethods.GET,
            url: '/friendship/find-pending-invites?userId=' + user?.id,
            successCallback: (data) => {
                setFriendRequests(data);
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    }

    function handleChangeStatusRequest(status: string, id: number) {
        request({
            method: HttpMethods.PUT,
            url: '/friendship/change-invite?status=' + status + '&inviteId=' + id,
            successCallback: () => {
                fetchFriendRequests();
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    }

    return (
        <List
            dataSource={friendRequests}
            renderItem={(item: any) => (
                <List.Item
                    actions={[
                        <Tooltip title="Aceitar">
                            <Button
                                type="link"
                                icon={<CheckOutlined />}
                                onClick={() => handleChangeStatusRequest('ACCEPTED', item.id)}
                            />
                        </Tooltip>,
                        <Tooltip title="Recusar">
                            <Button
                                type="link"
                                icon={<CloseOutlined />}
                                onClick={() => handleChangeStatusRequest('DECLINED', item.id)}
                            />
                        </Tooltip>
                    ]}
                >
                    <List.Item.Meta
                        title={item.sender}
                    />
                </List.Item>
            )}
        />
    );
};
