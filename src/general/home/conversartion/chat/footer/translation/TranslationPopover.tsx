import { TranslationOutlined } from '@ant-design/icons';
import { Button, Popover, Select, Switch, Tooltip } from 'antd';
import React from 'react';
import { useHomeContext } from '../../../../context/HomeContext.tsx';
import { TranslationPopoverProps } from '../../IChat.ts';
import './TranslationPopover.css';

const { Option } = Select;

export function TranslationPopover({
    languageFrom, setLanguageFrom, translationReceiving, setTranslationReceiving,
    configurateTranslation, popoverVisible, setPopoverVisible, setTranslationFrom
}: TranslationPopoverProps) {

    const { translationOptions } = useHomeContext();

    const content = (
        <div className="translation-popover-content">
            <div className="translation-options-container">
                <Tooltip title="Selecione o idioma para traduzir ao Receber">
                    <span className="translation-select-label">Traduzir ao receber:</span>
                    <Select
                        value={languageFrom}
                        onChange={(value, option: any) => {
                            setTranslationFrom(option.children + ' - ' + value);
                            setLanguageFrom(value)
                        }}
                        className="translation-select"
                        showSearch
                    >
                        {translationOptions.map(option => (
                            <Option key={option.code} value={option.code}>{option.name}</Option>
                        ))}
                    </Select>
                </Tooltip>
                <div className="translation-switch-container">
                    <span className="translation-switch-label">Ativar o modo tradução:</span>
                    <Switch checked={translationReceiving} onChange={() => setTranslationReceiving(!translationReceiving)} />
                </div>
            </div>
            <div className="translation-action-buttons">
                <Button type="dashed" className="translation-button-cancel" onClick={() => setPopoverVisible(false)}>Cancelar</Button>
                <Button type="primary" className="translation-button-save" onClick={configurateTranslation}>Salvar</Button>
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
            <Button
                icon={<TranslationOutlined />}
                onClick={() => setPopoverVisible(!popoverVisible)}
                className="translation-popover-trigger"
            />
        </Popover>
    );
}
