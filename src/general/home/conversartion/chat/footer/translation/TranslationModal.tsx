import React, { useState } from 'react';
import { QuestionCircleOutlined, TranslationOutlined } from '@ant-design/icons';
import { Button, List, Modal, Select, Switch, Tooltip, message } from 'antd';
import { useHomeContext } from '../../../../context/HomeContext';
import './TranslationModal.css';

const { Option } = Select;

export function TranslationModal({
    isReceivedLanguage,
    setIsReceivedLanguage,
    receivedLanguage,
    setReceivedLanguage,
    setIsImprovingText,
    isImprovingText,
    saveConfiguration
}) {
    const { translationOptions } = useHomeContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validateAndSave = () => {
        if (isReceivedLanguage && !receivedLanguage) {
            const error = 'Selecione um idioma para traduzir antes de ativar a tradução.';
            setErrorMessage(error);
            message.error(error);
        } else {
            setErrorMessage('');
            setModalVisible(false);
            saveConfiguration();
        }
    };

    const modalOptions = [
        {
            title: 'Traduzir ao receber',
            className: 'translation-receiving',
            itemClassName: 'translation-receiving-item',
            info: 'Selecione o idioma que suas mensagens recebidas serão traduzidas.',
            description: (
                <div className="translation-options-container">
                    <Select
                        value={receivedLanguage || 'pt'}
                        onChange={(value, option: any) => setReceivedLanguage(option.children)}
                        style={{ width: '100%' }}
                        showSearch
                        filterOption={(input, option: any) =>
                            option?.children?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {translationOptions.map(option => (
                            <Option key={option.code} value={option.code}>
                                {option.name}
                            </Option>
                        ))}
                    </Select>
                    <span className="translation-switch-label">Ativar:</span>
                    <Switch
                        checked={isReceivedLanguage}
                        onChange={() => setIsReceivedLanguage(!isReceivedLanguage)}
                    />
                </div>
            ),
        },
        {
            title: 'Melhorar texto com IA',
            className: 'text-improvement',
            itemClassName: 'text-improvement-item',
            info: 'Ative para melhorar o texto das mensagens recebidas. Exemplo: Correção ortográfica, correção gramatical.',
            description: (
                <Switch checked={isImprovingText} onChange={setIsImprovingText} />
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
                        disabled={isReceivedLanguage && !receivedLanguage}
                    >
                        Salvar
                    </Button>
                ]}
            >
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <List
                    itemLayout="horizontal"
                    dataSource={modalOptions}
                    renderItem={item => (
                        <List.Item className={item.className}>
                            <List.Item.Meta
                                className={item.itemClassName}
                                title={
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {item.title}
                                        <Tooltip title={item.info}>
                                            <QuestionCircleOutlined />
                                        </Tooltip>
                                    </div>
                                }
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
}