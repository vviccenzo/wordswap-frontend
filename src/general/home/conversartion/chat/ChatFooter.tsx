import React from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { TranslationPopover } from './translation/TranslationPopover.tsx';

interface ChatFooterProps {
    message: string;
    setMessage: (value: string) => void;
    handleSend: () => void;
    popoverVisible: boolean;
    setPopoverVisible: (visible: boolean) => void;
    languageTo: string;
    setLanguageTo: (value: string) => void;
    translationSending: boolean;
    setTranslationSending: (value: boolean) => void;
    languageFrom: string;
    setLanguageFrom: (value: string) => void;
    translationReceiving: boolean;
    setTranslationReceiving: (value: boolean) => void;
    configurateTranslation: () => void;
    setTranslationTo: (value: string) => void;
    setTranslationFrom: (value: string) => void;
}

export function ChatFooter({
    message, setMessage, handleSend, popoverVisible, setPopoverVisible,
    languageTo, setLanguageTo, translationSending, setTranslationSending,
    languageFrom, setLanguageFrom, translationReceiving, setTranslationReceiving, configurateTranslation, setTranslationTo, setTranslationFrom
}: ChatFooterProps) {
    return (
        <div className="chat-footer" style={{ display: 'flex', alignItems: 'center' }}>
            <TranslationPopover
                languageTo={languageTo}
                setLanguageTo={setLanguageTo}
                translationSending={translationSending}
                setTranslationSending={setTranslationSending}
                languageFrom={languageFrom}
                setLanguageFrom={setLanguageFrom}
                translationReceiving={translationReceiving}
                setTranslationReceiving={setTranslationReceiving}
                configurateTranslation={configurateTranslation}
                popoverVisible={popoverVisible}
                setPopoverVisible={setPopoverVisible}
                setTranslationTo={setTranslationTo}
                setTranslationFrom={setTranslationFrom}
            />
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
    );
}