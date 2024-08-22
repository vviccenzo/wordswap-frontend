import React, { useEffect, useState } from 'react';
import { Input, List, Avatar, Typography, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Message } from './Message.tsx';
import { useUser } from '../../../context/UserContext.tsx';
import { useHomeContext } from '../context/HomeContext.tsx';
import "./Chat.css";
import formatTimestamp from '../../../utils/formatTimestamp.ts';

const { Title } = Typography;


export function Chat() {

    const { user } = useUser();
    const { selectedConversation, stompClient, conversations } = useHomeContext();
    const [combinedMessages, setCombinedMessages] = useState<any[]>([]);

    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            const messageData = {
                senderId: user?.id,
                receiverId: selectedConversation?.friendId,
                conversationId: selectedConversation?.id,
                content: message,
            };

            stompClient.send('/app/chat/' + selectedConversation?.id, {}, JSON.stringify(messageData));

            setMessage('');
        }
    };

    useEffect(() => {
        if (selectedConversation) {
            let combinedMessagesNow: any[] = selectedConversation.messages.map((msg: any) => ({
                id: msg.id,
                content: msg.text,
                sender: msg.sender,
                timeStamp: msg.timestamp
            }))

            combinedMessagesNow.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

            setCombinedMessages(combinedMessagesNow);
        }
    }, [selectedConversation, conversations]);

    return (
        <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#DCDCDC', borderRadius: 20 }}>
            <div className='chat-header' style={{ marginBottom: '16px', display: 'flex', gap: 20 }}>
                <Avatar size={64} src={selectedConversation?.profilePicture} />
                <Title level={4} style={{ margin: '16px 0' }}>{selectedConversation?.conversationName}</Title>
            </div>
            <div className="chat-container">
                <List
                    itemLayout="horizontal"
                    dataSource={combinedMessages}
                    renderItem={(msg) => (
                        <Message
                            message={{
                                content: msg.content,
                                avatar: msg.sender === 'me' ? null : selectedConversation?.profilePicture,
                                senderName: msg.sender === 'me' ? 'You' : selectedConversation?.conversationName,
                                timeStamp: formatTimestamp(msg.timeStamp)
                            }}
                            isMe={msg.sender === 'me'}
                        />
                    )}
                />
            </div>
            <div className="chat-footer" style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onPressEnter={handleSend}
                    style={{ marginRight: '8px' }}
                />
                <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
                    Send
                </Button>
            </div>
        </div>
    );
}
