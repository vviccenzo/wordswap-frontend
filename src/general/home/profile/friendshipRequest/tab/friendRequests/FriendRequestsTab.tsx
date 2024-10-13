import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, List, Tooltip } from 'antd';
import React from 'react';
import { useHomeContext } from '../../../../context/HomeContext';
import { useUser } from '../../../../../../context/UserContext';
import { WebSocketEventType } from '../../../../../../utils/enum/WebSocketEventType';

import './FriendRequests.css';

export const FriendRequestsTab: React.FC = () => {
    const { user } = useUser();
    const { friendRequests, stompClient } = useHomeContext();

    function handleChangeStatusRequest(status: string, id: number) {
        const data = {
            action: WebSocketEventType.UPDATE_FRIEND_REQUEST,
            friendshipRequestUpdateDTO: {
                statusType: status,
                inviteId: id
            }
        };

        stompClient.send('/app/chat/' + user?.id, {}, JSON.stringify(data));
    }

    return (
        <List
            dataSource={friendRequests}
            renderItem={(item: any) => (
                <List.Item className="list-item">
                    <List.Item.Meta
                        title={item.sender}
                        className="list-item-meta"
                    />
                    <div className="action-buttons">
                        <Tooltip title="Aceitar">
                            <Button
                                type="link"
                                icon={<CheckOutlined />}
                                onClick={() => handleChangeStatusRequest('ACCEPTED', item.id)}
                            />
                        </Tooltip>
                        <Tooltip title="Recusar">
                            <Button
                                type="link"
                                icon={<CloseOutlined />}
                                onClick={() => handleChangeStatusRequest('DECLINED', item.id)}
                            />
                        </Tooltip>
                    </div>
                </List.Item>
            )}
        />
    );
};
