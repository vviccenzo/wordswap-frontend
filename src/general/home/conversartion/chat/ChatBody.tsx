import React from 'react';
import { List } from 'antd';
import VirtualList from 'rc-virtual-list';
import { Message } from '../Message.tsx';
import formatTimestamp from '../../../../utils/formatTimestamp.ts';

interface ChatBodyProps {
    messages: any[];
    selectedConversation: any;
}

export function ChatBody({ messages, selectedConversation }: ChatBodyProps) {
    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollTop === 0) {
            console.log('loadaaaaa')
        }
    };

    return (
        <div className="chat-container">
            <List itemLayout="horizontal">
                <VirtualList
                    data={messages}
                    height={1000}
                    itemHeight={47}
                    itemKey="id"
                    onScroll={onScroll}
                >
                    {(msg) => (
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
                </VirtualList>
            </List>
        </div>
    );
}
