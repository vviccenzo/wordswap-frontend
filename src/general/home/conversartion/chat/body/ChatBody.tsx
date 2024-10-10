import VirtualList, { ListRef } from 'rc-virtual-list';
import React, { useEffect, useRef, useState } from 'react';

import { Spin } from 'antd';
import { useUser } from '../../../../../context/UserContext';
import { useRequest } from '../../../../../hook/useRequest';
import { HttpMethods } from '../../../../../utils/IRequest';
import { useHomeContext } from '../../../context/HomeContext';
import { Message } from './../../message/Message';
import { ChatBodyProps, GetMessagePayload, Message as MessageType } from './../IChat';

import { formatDateForSeparator, shouldShowDateSeparator } from '../../../../../utils/functions/dateUtils';
import formatTimestamp from '../../../../../utils/functions/formatTimestamp';
import mapConversations from '../../../../../utils/mapper/conversationMapper';

import './ChatBody.css';

let previousDate: any = null;
const MESSAGES_PER_PAGE = 10;

export function ChatBody({ messages, selectedConversation }: ChatBodyProps) {
    const { user } = useUser();
    const { request } = useRequest();
    const { loading, setLoading, setScrollPage, scrollPage, handleConversationSelected, totalMessages } = useHomeContext();

    const [containerHeight, setContainerHeight] = useState<number>(1000);

    const listRef = useRef<ListRef>(null);

    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollTop === 0 && !loading && messages.length < totalMessages) {
            setLoading(true);
            setScrollPage(scrollPage + 1);
            getMessages();
        }
    };

    function getMessages() {
        const data: GetMessagePayload = {
            userId: user?.id,
            conversationId: selectedConversation?.id,
            pageNumber: scrollPage,
            pageSize: MESSAGES_PER_PAGE
        };

        request({
            method: HttpMethods.POST,
            url: '/message/get-messages',
            data: data,
            successCallback: (data) => {
                const conv = mapConversations(data, user);

                conv.messages = [
                    ...selectedConversation.messages,
                    ...conv.messages.filter(newMessage =>
                        !selectedConversation.messages.some(oldMessage => oldMessage.id === newMessage.id)
                    )
                ];

                conv.messages.sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());

                handleConversationSelected(conv);
                setLoading(false);
            },
            errorCallback: (error) => {
                console.error('Error loading messages', error);
                setLoading(false);
            }
        });
    }

    useEffect(() => {
        const updateHeight = () => setContainerHeight(window.innerHeight * 0.8);
        window.addEventListener('resize', updateHeight);
        updateHeight();

        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return (
        <div className="chat-body">
            {loading && (
                <div className="loading-notification">
                    <Spin size="large" />
                    <span>Carregando mais mensagens...</span>
                </div>
            )}

            <VirtualList
                ref={listRef}
                data={messages}
                height={containerHeight}
                itemKey="id"
                onScroll={onScroll}
            >
                {(msg: MessageType) => {
                    const currentDate = msg.timeStamp;
                    const showDateSeparator = shouldShowDateSeparator(currentDate, previousDate);
                    const separatorDate = showDateSeparator ? formatDateForSeparator(currentDate) : null;
                    previousDate = currentDate;

                    return (
                        <Message
                            key={msg.id}
                            message={{
                                id: msg.id,
                                content: msg.content,
                                avatar: msg.sender === 'me' ? null : selectedConversation?.profilePicture,
                                senderName: msg.sender === 'me' ? 'You' : selectedConversation?.conversationName,
                                timestamp: formatTimestamp(msg.timeStamp),
                                isEdited: msg.edited,
                                isDeleted: msg.deleted,
                                messageContent: msg.messageContent,
                                date: msg.timeStamp,
                                image: msg.image
                            }}
                            isMe={msg.sender === 'me'}
                            showDateSeparator={showDateSeparator}
                            separatorDate={separatorDate}
                        />
                    );
                }}
            </VirtualList>
        </div>
    );
}
