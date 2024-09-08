import React from 'react';
import { Button, Divider, Select, Switch, Tooltip, Popover } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import { useHomeContext } from '../../../context/HomeContext.tsx';

const { Option } = Select;

interface TranslationPopoverProps {
    languageTo: string;
    setLanguageTo: (value: string) => void;
    translationSending: boolean;
    setTranslationSending: (value: boolean) => void;
    languageFrom: string;
    setLanguageFrom: (value: string) => void;
    translationReceiving: boolean;
    setTranslationReceiving: (value: boolean) => void;
    configurateTranslation: () => void;
    popoverVisible: boolean;
    setPopoverVisible: (visible: boolean) => void;
    setTranslationTo: (value: string) => void;
    setTranslationFrom: (value: string) => void;
}

export function TranslationPopover({
    languageTo, setLanguageTo, translationSending, setTranslationSending,
    languageFrom, setLanguageFrom, translationReceiving, setTranslationReceiving,
    configurateTranslation, popoverVisible, setPopoverVisible,
    setTranslationTo, setTranslationFrom
}: TranslationPopoverProps) {

    const { translationOptions } = useHomeContext();

    const content = (
        <div>
            {/* <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tooltip title="Selecione o idioma para traduzir ao Enviar">
                    <span>Traduzir ao enviar:</span>
                    <Select
                        value={languageTo}
                        onChange={(value, option: any) => {
                            setTranslationTo(option.children + ' - ' + value);
                            setLanguageTo(value)
                        }}
                        style={{ width: '150px', marginLeft: '18px' }}
                        defaultValue="pt-br"
                        showSearch
                    >
                        {translationOptions.map(option => (
                            <Option key={option.code} value={option.code}>{option.name}</Option>
                        ))}
                    </Select>
                </Tooltip>
                <div style={{ display: 'flex', gap: 5 }}>
                    <span>Ativar o modo tradução:</span>
                    <Switch checked={translationSending} onChange={() => setTranslationSending(!translationSending)} />
                </div>
            </div>
            <Divider /> */}
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tooltip title="Selecione o idioma para traduzir ao Receber">
                    <span style={{ marginRight: '20px' }}>Traduzir ao receber:</span>
                    <Select
                        value={languageFrom}
                        onChange={(value, option: any) => {
                            setTranslationFrom(option.children + ' - ' + value);
                            setLanguageFrom(value)
                        }}
                        style={{ width: '150px' }}
                        showSearch
                    >
                        {translationOptions.map(option => (
                            <Option key={option.code} value={option.code}>{option.name}</Option>
                        ))}
                    </Select>
                </Tooltip>
                <div style={{ display: 'flex', gap: 5 }}>
                    <span style={{ marginLeft: '18px' }}>Ativar o modo tradução:</span>
                    <Switch checked={translationReceiving} onChange={() => setTranslationReceiving(!translationReceiving)} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, paddingTop: 8 }}>
                <Button type="dashed" onClick={() => setPopoverVisible(false)}>Cancelar</Button>
                <Button type="primary" onClick={configurateTranslation}>Salvar</Button>
            </div>
        </div>
    );

    return (
        <Popover
            content={content}
            title="Opções de Tradução"
            trigger="click"
            open={popoverVisible}
        >
            <Button icon={<TranslationOutlined />} onClick={() => setPopoverVisible(!popoverVisible)} style={{ marginRight: '8px', fontSize: '18px' }} />
        </Popover>
    );
}
