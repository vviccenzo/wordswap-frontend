import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Image, Input, List, Menu, Popover, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { useUser } from '../../../../context/UserContext';
import { WebSocketEventType } from '../../../../utils/enum/WebSocketEventType';
import { useHomeContext } from '../../context/HomeContext';
import './Message.css';
import moment from 'moment';

const { Text } = Typography;

const MessageContent = ({ message, isEditing, editedMessage, setEditedMessage, handleKeyDown, handleSave, handleCancel }) => {
    if (message.isDeleted) {
        return (
            <div className="message-deleted">
                <em>(Mensagem Deletada)</em>
                <span>{message.timestamp}</span>
            </div>
        );
    }

    if (isEditing) {
        return (
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
        );
    }

    return (
        <>
            {message.type === 'GROUP' && message.senderName && (
                <div
                    className="sender-name"
                    style={{ color: getRandomColor(), fontWeight: 'bold', marginBottom: 4 }}
                >
                    {message.senderName}
                </div>
            )}

            {message.image && (
                <div className="message-image">
                    <Image
                        src={`data:image/jpeg;base64,${message.image}`}
                        style={{ width: '100%', height: '20%' }}
                    />
                </div>
            )}

            <div className="message-info">
                <Text>
                    {message.content}
                    {message.isEdited && <em className="message-edited">(editada)</em>}
                    {message.originalContent && (
                        <Tooltip title={`Mensagem original: ${message.originalContent}`}>
                            <InfoCircleOutlined style={{ marginLeft: 8, fontSize: 12, cursor: 'pointer' }} />
                        </Tooltip>
                    )}
                </Text>
                <span className="timestamp">
                    {message.timestamp}
                    {message.viewed && (
                        <CheckOutlined style={{
                            display: 'inline-block',
                            color: 'purple',
                            fontSize: 14,
                            marginLeft: 8,
                        }} />
                    )}
                </span>
            </div>
        </>
    );
};

const MessageInfoPopover = ({ message }) => (
    <div className="message-info-popover">
        <p><strong>Enviado por:</strong> {message.senderName}</p>
        <p><strong>Data:</strong> {message.timestamp}</p>
        {message.isEdited && <p><strong>Editado:</strong> Sim</p>}
        <p><strong>Visualizado as :</strong> {moment(message.viewedTime).format('HH:mm:ss') || 'Nunca'}</p>
        <p><strong>Mensagem Original:</strong> {message.originalContent || 'N/A'}</p>
    </div>
);

const MessageMenu = ({ isMe, message, setIsEditing, handleMenuClick, showMessageInfo, setShowMessageInfo }) => (
    <Menu className="dropdown-content">
        {isMe && !message.isDeleted && (
            <Menu.Item key="edit" onClick={() => setIsEditing(true)} className="menu-item-message">
                Editar mensagem
            </Menu.Item>
        )}
        {!message.isDeleted && (
            <Menu.Item key="delete" onClick={() => handleMenuClick('delete')} className="menu-item-message">
                Apagar mensagem
            </Menu.Item>
        )}
        <Menu.Item key="info" className="menu-item-message">
            <Popover
                content={<MessageInfoPopover message={message} />}
                title="Informações da Mensagem"
                trigger="hover"
            >
                <span onClick={() => setShowMessageInfo(!showMessageInfo)}>Informações da mensagem</span>
            </Popover>
        </Menu.Item>
    </Menu>
);

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export function Message({ message, isMe, showDateSeparator, separatorDate }) {
    const { user } = useUser();
    const { stompClient } = useHomeContext();

    const [isEditing, setIsEditing] = useState(false);
    const [showMessageInfo, setShowMessageInfo] = useState(false);
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
        stompClient.send(`/app/chat/${user?.id}`, {}, JSON.stringify({
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

    return (
        <div>
            {showDateSeparator && separatorDate && (
                <Divider className="date-separator">{separatorDate}</Divider>
            )}
            <List.Item className={`message-container ${isMe ? 'me' : 'not-me'}`}>
                <Dropdown overlay={
                    <MessageMenu
                        isMe={isMe}
                        message={message}
                        setIsEditing={setIsEditing}
                        handleMenuClick={handleMenuClick}
                        showMessageInfo={showMessageInfo}
                        setShowMessageInfo={setShowMessageInfo}
                    />
                } trigger={['contextMenu']}>
                    <div className={`message-content ${isMe ? 'me' : ''}`}>
                        <MessageContent
                            message={message}
                            isEditing={isEditing}
                            editedMessage={editedMessage}
                            setEditedMessage={setEditedMessage}
                            handleKeyDown={handleKeyDown}
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                        />
                    </div>
                </Dropdown>
            </List.Item>
        </div>
    );
}