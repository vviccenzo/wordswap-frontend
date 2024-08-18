import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Input, Button, List, Tooltip } from 'antd';
import { useRequest } from '../../../hook/useRequest.ts';
import { HttpMethods } from '../../../utils/IRequest.ts';
import { useUser } from '../../../context/UserContext.tsx';
import { Notification } from '../../../utils/Notification.tsx';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export function FriendshipRequestModal({ isModalOpen, setIsModalOpen }) {

    const { user } = useUser();
    const { request } = useRequest();

    const [friendCode, setFriendCode] = useState('');
    const [friendRequests, setFriendRequests] = useState<any>([]);
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const mockFriendsList = [
        { id: 1, name: 'Alice Doe' },
        { id: 2, name: 'Charlie Brown' },
    ];

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
    };

    function handleAddFriend() {
        request({
            method: HttpMethods.POST,
            url: '/friendship/send-invite',
            data: {
                senderId: user?.id,
                targetUserCode: friendCode
            },
            successCallback: (data) => {
                Notification({ message: 'Convite enviado', description: "Convite enviado com sucesso", placement: 'top', type: 'success' });
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });

        setFriendCode('');
    };

    function handleChangeStatusRequest(status, id) {
        request({
            method: HttpMethods.PUT,
            url: '/friendship/change-invite?status=' + status + '&inviteId=' + id,
            successCallback: (data) => {
                fetchFriendRequests();
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    }

    return (
        <Modal
            title="Amizades"
            centered
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ style: { display: 'none' } }}
            width={600}
        >
            <Tabs defaultActiveKey="1">
                <TabPane tab="Adicionar Amigos" key="1">
                    <Input
                        value={friendCode}
                        onChange={(e) => setFriendCode(e.target.value)}
                        placeholder="Digite o código do usuário"
                        style={{ marginBottom: 16 }}
                    />
                    <Button type="primary" onClick={handleAddFriend}>
                        Enviar Convite
                    </Button>
                </TabPane>
                <TabPane tab="Lista de Amigos" key="2">
                    <List
                        dataSource={mockFriendsList}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.name}
                                />
                            </List.Item>
                        )}
                    />
                </TabPane>
                <TabPane tab="Solicitações" key="3">
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
                </TabPane>
            </Tabs>
        </Modal>
    );
}
