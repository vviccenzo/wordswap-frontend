import React, { useState } from 'react';
import { Button, Divider, Dropdown, Input, List, Menu, Typography } from 'antd';
import { useUser } from '../../../context/UserContext.tsx';
import { WebSocketEventType } from '../../../utils/enum/WebSocketEventType.ts';
import { useHomeContext } from '../context/HomeContext.tsx';
import getContent from '../../../utils/functions/getContent.ts';

const { Text } = Typography;

export function Message({ message, isMe, conv, showDateSeparator, separatorDate }) {

    const { user } = useUser();
    const { stompClient } = useHomeContext();

    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message.content);

    function handlEditMessage() {
        const data = {
            action: WebSocketEventType.EDIT_MESSAGE,
            messageEditDTO: {
                id: message.id,
                content: editedMessage
            }
        }

        stompClient.send('/app/chat/' + user?.id, {}, JSON.stringify(data));
    }

    function handleDeleteMessage() {
        const data = {
            action: WebSocketEventType.EDIT_MESSAGE,
            MessageDeleteDTO: {
                id: message.id,
            }
        }

        stompClient.send('/app/chat/delete/' + user?.id, {}, JSON.stringify(data));
    }

    const handleMenuClick = (key) => {
        if (key === 'edit') {
            setIsEditing(true);
            handlEditMessage();
        } else if (key === 'delete') {
            handleDeleteMessage();
        }
    };

    const handleSave = () => {
        handlEditMessage();
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedMessage(message.content);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const menu = (
        <Menu>
            {isMe && (
                <Menu.Item key="edit" onClick={() => setIsEditing(true)}>
                    Editar mensagem
                </Menu.Item>
            )}
            <Menu.Item key="delete" onClick={() => handleMenuClick('delete')}>
                Apagar mensagem
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
            {showDateSeparator && separatorDate && (
                <>
                    <Divider />
                    <div style={{
                        textAlign: 'center',
                        margin: '20px 0',
                        color: '#888',
                        fontWeight: 'bold',
                    }}>
                        {separatorDate}
                    </div>
                </>
            )}
            <List.Item
                style={{
                    display: 'flex',
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                    marginBottom: '8px',
                    marginRight: isMe ? 10 : '0',
                }}
            >
                <Dropdown
                    overlay={menu}
                    trigger={['contextMenu']}
                >
                    <div
                        style={{
                            background: isMe ? '#dcf8c6' : '#fff',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            maxWidth: '60%',
                            wordBreak: 'break-word',
                        }}
                    >
                        {message.isDeleted ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <em style={{ fontStyle: 'italic', color: '#888' }}>(Mensagem Deletada)</em>
                                <span style={{
                                    fontSize: '10px',
                                    color: '#888',
                                    flexShrink: 0,
                                    marginTop: 6
                                }}>
                                    {message.timestamp}
                                </span>
                            </div>
                        ) : (
                            <>
                                {isEditing ? (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Input
                                            value={editedMessage}
                                            onChange={(e) => setEditedMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            style={{ marginRight: '8px' }}
                                        />
                                        <Button type="primary" onClick={handleSave} style={{ marginRight: '8px' }}>Salvar</Button>
                                        <Button onClick={handleCancel}>Cancelar</Button>
                                    </div>
                                ) : (
                                    <div className="message-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <Text style={{ marginRight: '10px' }}>
                                            {message.isDeleted ? (
                                                <em style={{ fontStyle: 'italic', color: '#888' }}>(Mensagem Deletada)</em>
                                            ) : (
                                                <>
                                                    {getContent(user, conv, message)} {message.isEdited && <em style={{ fontSize: '10px', color: '#888' }}>(editada)</em>}
                                                </>
                                            )}
                                        </Text>
                                        <span style={{
                                            fontSize: '10px',
                                            color: '#888',
                                            flexShrink: 0,
                                            marginBottom: '1px',
                                        }}>
                                            {message.timestamp}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Dropdown>
            </List.Item>
        </div>
    );
}