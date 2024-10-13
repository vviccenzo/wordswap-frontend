import { Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { useUser } from '../../../../../../context/UserContext';
import { useHomeContext } from '../../../../context/HomeContext';
import { WebSocketEventType } from '../../../../../../utils/enum/WebSocketEventType';
import { Notification } from '../../../../../../utils/Notification';

import './AddFriend.css';
import { CopyOutlined } from '@ant-design/icons';

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

    const handleCopyToClipboard = () => {
        if (user?.userCode) {
            navigator.clipboard.writeText(user.userCode);
            message.success('Código copiado para a área de transferência!');
        }
    };

    return (
        <>
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
            <div className="friend-code-container" style={{ marginTop: '16px' }}>
                <span className="user-friend-code" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Seu código de Amigo:
                </span>
                <div className="friend-code-box" style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    <Input
                        readOnly
                        value={user?.userCode}
                        className="friend-code-display"
                        style={{ width: '100%', marginRight: '8px' }}
                    />
                    <Button
                        icon={<CopyOutlined />}
                        onClick={handleCopyToClipboard}
                        className="copy-button"
                    >
                        Copiar
                    </Button>
                </div>
            </div>
        </>
    );
};