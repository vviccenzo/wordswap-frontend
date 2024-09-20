import React, { useState } from 'react';
import { Button, Divider, Dropdown, Input, List, Menu, Typography } from 'antd';
import { useUser } from '../../../../context/UserContext.tsx';
import { WebSocketEventType } from '../../../../utils/enum/WebSocketEventType.ts';
import { useHomeContext } from '../../context/HomeContext.tsx';
import getContent from '../../../../utils/functions/getContent.ts';
import './Message.css';  // Import the CSS file

const { Text } = Typography;

export function Message({ message, isMe, conv, showDateSeparator, separatorDate }) {
    const { user } = useUser();
    const { stompClient } = useHomeContext();

    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message.content);

    const handleEditMessage = () => {
        stompClient.send(`/app/chat/${user?.id}`, {}, JSON.stringify({
            action: WebSocketEventType.EDIT_MESSAGE,
            messageEditDTO: {
                id: message.id,
                content: editedMessage,
            },
        }));
    };

    const handleDeleteMessage = () => {
        stompClient.send(`/app/chat/delete/${user?.id}`, {}, JSON.stringify({
            action: WebSocketEventType.DELETE_MESSAGE,
            messageDeleteDTO: {
                id: message.id,
            },
        }));
    };

    const handleMenuClick = (key) => {
        if (key === 'edit') setIsEditing(true);
        else if (key === 'delete') handleDeleteMessage();
    };

    const handleSave = () => {
        handleEditMessage();
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedMessage(message.content);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleCancel();
    };

    const renderMessageContent = () => {
        if (message.isDeleted) {
            return (
                <div className="message-deleted">
                    <em>(Mensagem Deletada)</em>
                    <span>{message.timestamp}</span>
                </div>
            );
        }

        return isEditing ? (
            <div className="message-edit">
                <Input
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input"
                />
                <Button type="primary" onClick={handleSave} className="button">Salvar</Button>
                <Button onClick={handleCancel}>Cancelar</Button>
            </div>
        ) : (
            <div className="message-info">
                <Text>
                    {getContent(user, conv, message)}
                    {message.isEdited && <em className="message-edited">(editada)</em>}
                </Text>
                <span className="timestamp">{message.timestamp}</span>
            </div>
        );
    };

    const menu = (
        <Menu className="dropdown-content">
            {isMe && <Menu.Item key="edit" onClick={() => setIsEditing(true)} className="menu-item-message">Editar mensagem</Menu.Item>}
            <Menu.Item key="delete" onClick={() => handleMenuClick('delete')} className="menu-item-message">Apagar mensagem</Menu.Item>
        </Menu>
    );

    return (
        <div>
            {showDateSeparator && separatorDate && (
                <>
                    <Divider className="date-separator">{separatorDate}</Divider>
                </>
            )}
            <List.Item className={`message-container ${isMe ? 'me' : 'not-me'}`}>
                <Dropdown overlay={menu} trigger={['contextMenu']}>
                    <div className={`message-content ${isMe ? 'me' : ''}`}>
                        {renderMessageContent()}
                    </div>
                </Dropdown>
            </List.Item>
        </div>
    );
}