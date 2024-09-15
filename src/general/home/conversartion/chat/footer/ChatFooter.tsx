import React from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { TranslationPopover } from './translation/TranslationPopover.tsx';
import { ChatFooterProps } from '../IChat.ts';

import './ChatFooter.css';

export function ChatFooter({
    message, setMessage, handleSend, popoverVisible, setPopoverVisible,
    languageFrom, setLanguageFrom, translationReceiving, setTranslationReceiving, configurateTranslation, setTranslationFrom
}: ChatFooterProps) {
    return (
        <div className="chat-footer">
            <TranslationPopover
                languageFrom={languageFrom}
                setLanguageFrom={setLanguageFrom}
                translationReceiving={translationReceiving}
                setTranslationReceiving={setTranslationReceiving}
                configurateTranslation={configurateTranslation}
                popoverVisible={popoverVisible}
                setPopoverVisible={setPopoverVisible}
                setTranslationFrom={setTranslationFrom}
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
