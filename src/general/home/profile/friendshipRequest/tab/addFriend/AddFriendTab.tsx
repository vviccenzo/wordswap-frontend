import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { useUser } from '../../../../../../context/UserContext';
import { useHomeContext } from '../../../../context/HomeContext';
import { WebSocketEventType } from '../../../../../../utils/enum/WebSocketEventType';
import { Notification } from '../../../../../../utils/Notification';

import './AddFriend.css';

export const AddFriendTab: React.FC = () => {
    const { user } = useUser();
    const { stompClient } = useHomeContext();

    const [friendCode, setFriendCode] = useState('');

    function handleAddFriend() {
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
        <div className="add-friend-tab">
            <Input
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="Digite o código do usuário"
                className="input-field"
            />
            <Button data-testid="send-invite-button" type="primary" onClick={handleAddFriend} className="send-button">
                Enviar Convite
            </Button>
        </div>
    );
};