import React from 'react';
import { List } from 'antd';
import { Message } from '../Message.tsx';
import formatTimestamp from '../../../../utils/formatTimestamp.ts';

interface MessageProps {
    id: string;
    content: string;
    avatar?: string;
    senderName: string;
    timestamp: string;
    isEdited: boolean;
    isDeleted: boolean;
    messageContent: any;
}

interface ChatBodyProps {
    messages: any[];
    selectedConversation: any;
}

export function ChatBody({ messages, selectedConversation }: ChatBodyProps) {
    return (
        <div className="chat-container">
            <List
                itemLayout="horizontal"
                dataSource={messages}
                renderItem={(msg) => (
                    <Message
                        message={{
                            id: msg.id,
                            content: msg.content,
                            avatar: msg.sender === 'me' ? null : selectedConversation?.profilePicture,
                            senderName: msg.sender === 'me' ? 'You' : selectedConversation?.conversationName,
                            timestamp: formatTimestamp(msg.timeStamp),
                            isEdited: msg.isEdited,
                            isDeleted: msg.isDeleted,
                            messageContent: msg.messageContent
                        }}
                        isMe={msg.sender === 'me'}
                        conv={selectedConversation}
                    />
                )}
            />
        </div>
    );
}
