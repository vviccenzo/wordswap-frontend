import React from 'react';
import { SendOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { TranslationModal } from './translation/TranslationModal.tsx';
import { ChatFooterProps } from '../IChat.ts';

import './ChatFooter.css';

export function ChatFooter({
    message, setMessage, handleSend,
    languageFrom, setLanguageFrom, translationReceiving, 
    setTranslationReceiving, configurateTranslation, setTranslationFrom,
    setIsImprovingText, isImprovingText, translationFrom
}: ChatFooterProps) {

    return (
        <div className="chat-footer">
            <TranslationModal
                languageFrom={languageFrom}
                setLanguageFrom={setLanguageFrom}
                translationReceiving={translationReceiving}
                setTranslationReceiving={setTranslationReceiving}
                configurateTranslation={configurateTranslation}
                setTranslationFrom={setTranslationFrom}
                setIsImprovingText={setIsImprovingText}
                isImprovingText={isImprovingText}
                translationFrom={translationFrom}
            />
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPressEnter={handleSend}
                placeholder='Mensagem'
            />
            <Button icon={<SendOutlined />} onClick={handleSend}>
                Enviar
            </Button>
        </div>
    );
}