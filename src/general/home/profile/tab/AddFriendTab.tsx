import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { useUser } from '../../../../context/UserContext.tsx';
import { useRequest } from '../../../../hook/useRequest.ts';
import { HttpMethods } from '../../../../utils/IRequest.ts';
import { Notification } from '../../../../utils/Notification.tsx';

export const AddFriendTab: React.FC = () => {
    const { user } = useUser();
    const { request } = useRequest();
    const [friendCode, setFriendCode] = useState('');

    const handleAddFriend = () => {
        request({
            method: HttpMethods.POST,
            url: '/friendship/send-invite',
            data: {
                senderId: user?.id,
                targetUserCode: friendCode
            },
            successCallback: () => {
                Notification({ message: 'Convite enviado', description: "Convite enviado com sucesso", placement: 'top', type: 'success' });
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });

        setFriendCode('');
    };

    return (
        <div>
            <Input
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="Digite o código do usuário"
                style={{ marginBottom: 16 }}
            />
            <Button type="primary" onClick={handleAddFriend}>
                Enviar Convite
            </Button>
        </div>
    );
};
