import React, { useEffect, useState } from 'react';
import { Input, List, Avatar, Typography, Button, Tooltip, Select, Popover, Switch, Divider } from 'antd';
import { SendOutlined, TranslationOutlined } from '@ant-design/icons';
import { Message } from './Message.tsx';
import { useUser } from '../../../context/UserContext.tsx';
import { useHomeContext } from '../context/HomeContext.tsx';
import { useRequest } from "../../../hook/useRequest.ts";
import { HttpMethods } from '../../../utils/IRequest.ts';
import { Notification } from '../../../utils/Notification.tsx';

import formatTimestamp from '../../../utils/formatTimestamp.ts';
import "./Chat.css";

const { Title } = Typography;

export function Chat() {

    const { user } = useUser();
    const { request } = useRequest();

    const { selectedConversation, stompClient, conversations } = useHomeContext();
    const [combinedMessages, setCombinedMessages] = useState<any[]>([]);

    const [message, setMessage] = useState('');
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [languageTo, setLanguageTo] = useState<string>('pt');
    const [languageFrom, setLanguageFrom] = useState<string>('pt');

    const [translationReceiving, setTranslationReceiving] = useState<boolean>(false);
    const [translationSending, setTranslationSending] = useState(false);
    const [translationOptions, setTranslationOptions] = useState<any[]>([]);

    const handleSend = () => {
        if (message.trim()) {
            const messageData = {
                senderId: user?.id,
                receiverId: selectedConversation?.receiverId,
                conversationId: selectedConversation?.id,
                content: message,
            };

            stompClient.send('/app/chat/' + selectedConversation?.id, {}, JSON.stringify(messageData));

            setMessage('');
        }
    };

    function configurateTranslation() {
        const data = {
            userId: user?.id,
            conversationId: selectedConversation?.id,
            sendingTranslation: languageTo,
            receivingTranslation: languageFrom,
            isSendingTranslation: translationSending,
            isReceivingTranslation: translationReceiving
        };

        request({
            method: HttpMethods.POST,
            url: '/conversation/configuration',
            data: data,
            successCallback: (data) => {
                console.log(data);
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        })
    }

    const content = (
        <div>
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tooltip title="Selecione o idioma para traduzir ao Enviar">
                    <span>Traduzir ao enviar:</span>
                    <Select
                        value={languageTo}
                        options={translationOptions.map(option => ({ label: option.name, value: option.code })) || []}
                        onChange={value => setLanguageTo(value)}
                        style={{ width: '150px', marginLeft: '18px' }}
                        defaultValue="pt-br"
                        showSearch
                    />
                </Tooltip>
                <div style={{ display: 'flex', gap: 5 }}>
                    <span>
                        Ativar o modo tradução:
                    </span>
                    <Switch checked={translationSending} onChange={() => setTranslationSending(!translationSending)} />
                </div>
            </div>
            <Divider />
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tooltip title="Selecione o idioma para traduzir ao Receber">
                    <span style={{ marginRight: '20px' }}>Traduzir ao receber:</span>
                    <Select
                        value={languageFrom}
                        options={translationOptions.map(option => ({ label: option.name, value: option.code })) || []}
                        onChange={value => setLanguageFrom(value)}
                        style={{ width: '150px' }}
                        showSearch
                    />
                </Tooltip>
                <div style={{ display: 'flex', gap: 5 }}>
                    <span style={{ marginLeft: '18px' }}>
                        Ativar o modo tradução:
                    </span>
                    <Switch checked={translationReceiving} onChange={() => setTranslationReceiving(!translationReceiving)} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, paddingTop: 8 }}>
                <Button
                    type="dashed"
                    onClick={() => setPopoverVisible(false)}
                >
                    Cancelar
                </Button>
                <Button
                    type="primary"
                    onClick={() => configurateTranslation()}
                >
                    Salvar
                </Button>
            </div>
        </div>
    );

    useEffect(() => {
        if (selectedConversation) {
            setCombinedMessages(selectedConversation.messages);
        }
    }, [selectedConversation, conversations]);

    useEffect(() => {
        if (popoverVisible) {
            request({
                method: HttpMethods.GET,
                url: '/translation/find-options-translation',
                successCallback: (data) => {
                    setTranslationOptions(data);
                },
                errorCallback: (error) => {
                    Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
                }
            });
        }
    }, [popoverVisible]);

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
            <div className="chat-footer" style={{ display: 'flex', alignItems: 'center' }}>
                <Popover
                    content={content}
                    title="Opções de Tradução"
                    trigger="click"
                    open={popoverVisible}
                >
                    <TranslationOutlined
                        onClick={() => setPopoverVisible(!popoverVisible)}
                        style={{ marginRight: '8px', fontSize: '18px', cursor: 'pointer' }}
                    />
                </Popover>
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
