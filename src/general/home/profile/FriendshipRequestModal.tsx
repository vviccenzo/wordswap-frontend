import React, { useState } from 'react';
import { Modal, Tabs, Input, Button, List } from 'antd';
import { useRequest } from '../../../hook/useRequest.ts';
import { HttpMethods } from '../../../utils/IRequest.ts';
import { useUser } from '../../../context/UserContext.tsx';
import { Notification } from '../../../utils/Notification.tsx';

const { TabPane } = Tabs;

export function FriendshipRequestModal({ isModalOpen, setIsModalOpen }) {

    const { user } = useUser();
    const { request } = useRequest();

    const [friendCode, setFriendCode] = useState('');
    const [friendRequests, setFriendRequests] = useState([]);
    const [friendsList, setFriendsList] = useState([]);

    const mockFriendRequests = [
        { id: 1, name: 'Jane Smith' },
        { id: 2, name: 'Bob Johnson' },
    ];

    const mockFriendsList = [
        { id: 1, name: 'Alice Doe' },
        { id: 2, name: 'Charlie Brown' },
    ];

    function useAddFriend() {
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
                    <Button type="primary" onClick={useAddFriend}>
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
                        dataSource={mockFriendRequests}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.name}
                                />
                            </List.Item>
                        )}
                    />
                </TabPane>
            </Tabs>
        </Modal>
    );
}
