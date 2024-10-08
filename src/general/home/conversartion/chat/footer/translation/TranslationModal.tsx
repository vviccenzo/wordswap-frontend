import { TranslationOutlined } from '@ant-design/icons';
import { Button, List, Modal, Select, Switch, Tooltip, message } from 'antd';
import React from 'react';
import { useHomeContext } from '../../../../context/HomeContext';
import './TranslationModal.css';

const { Option } = Select;

export function TranslationModal({ 
    languageFrom, setLanguageFrom,
    translationReceiving, setTranslationReceiving, configurateTranslation, setTranslationFrom,
    setIsImprovingText, isImprovingText, translationFrom
}) {
    const { translationOptions } = useHomeContext();

    const [modalVisible, setModalVisible] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const validateAndSave = () => {
        if (translationReceiving && (!languageFrom || !translationFrom)) {
            setErrorMessage('Selecione um idioma para traduzir antes de ativar a tradução.');
            message.error('Selecione um idioma para traduzir antes de ativar a tradução.');
        } else {
            setErrorMessage('');
            configurateTranslation();
            setModalVisible(false);
        }
    };

    const modalOptions = [
        {
            title: 'Traduzir ao receber',
            className: 'translation-receiving',
            itemClassName: 'translation-receiving-item',
            description: (
                <div className="translation-options-container">
                    <Select
                        value={languageFrom}
                        onChange={(value, option: any) => {
                            setTranslationFrom(option + ' - ' + value);
                            setLanguageFrom(option.children);
                        }}
                        style={{ width: '100%' }}
                        showSearch
                    >
                        {translationOptions.map(option => (
                            <Option key={option.code} value={option.code}>
                                {option.name}
                            </Option>
                        ))}
                    </Select>
                    <span className="translation-switch-label">Ativar:</span>
                    <Switch
                        checked={translationReceiving}
                        onChange={() => setTranslationReceiving(!translationReceiving)}
                    />
                </div>
            ),
        },
        {
            title: 'Melhorar texto com IA',
            className: 'text-improvement',
            itemClassName: 'text-improvement-item',
            description: (
                <>
                    <Switch checked={isImprovingText} onChange={setIsImprovingText} />
                </>
            )
        }
    ];

    return (
        <>
            <Button
                icon={<TranslationOutlined />}
                onClick={() => setModalVisible(true)}
                className="translation-modal-trigger"
            />
            <Modal
                title="Opções de Tradução"
                className="translation-modal"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button
                        key="cancel"
                        type="dashed"
                        onClick={() => setModalVisible(false)}
                        className="translation-button-cancel"
                    >
                        Cancelar
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        onClick={validateAndSave}
                        className="translation-button-save"
                        disabled={translationReceiving && (!languageFrom || !translationFrom)}
                    >
                        Salvar
                    </Button>
                ]}
            >
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Exibe a mensagem de erro, se houver */}
                <List
                    itemLayout="horizontal"
                    dataSource={modalOptions}
                    renderItem={item => (
                        <List.Item className={item.className}>
                            <List.Item.Meta className={item.itemClassName}
                                title={<Tooltip title={item.title}>{item.title}</Tooltip>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
}
