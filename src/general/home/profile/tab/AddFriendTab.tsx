import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { useUser } from '../../../../context/UserContext.tsx';
import { WebSocketEventType } from '../../../../utils/enum/WebSocketEventType.ts';
import { Notification } from '../../../../utils/Notification.tsx';
import { useHomeContext } from '../../context/HomeContext.tsx';

export const AddFriendTab: React.FC = () => {

    const { user } = useUser();
    const { stompClient } = useHomeContext();

    const [friendCode, setFriendCode] = useState('');

    const handleAddFriend = () => {
        const data = {
            action: WebSocketEventType.SEND_FRIEND_REQUEST,
            friendRequestDTO: {
                senderId: user?.id,
                targetUserCode: friendCode,
            }
        };

        stompClient.send('/app/chat/' + user?.id, {}, JSON.stringify(data));

        Notification({ message: 'Convite enviado', description: "Convite enviado com sucesso", placement: 'top', type: 'success' });
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
