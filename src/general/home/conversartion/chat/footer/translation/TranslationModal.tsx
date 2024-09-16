import { TranslationOutlined } from '@ant-design/icons';
import { Button, List, Modal, Select, Switch, Tooltip } from 'antd';
import React from 'react';
import { useHomeContext } from '../../../../context/HomeContext.tsx';
import './TranslationModal.css';

const { Option } = Select;

export function TranslationModal({ languageFrom, setLanguageFrom,
    translationSending, setTranslationSending, configurateTranslation, setTranslationFrom
}) {
    const { translationOptions } = useHomeContext();

    const [modalVisible, setModalVisible] = React.useState(false);
    const [textImprovement, setTextImprovement] = React.useState(false);

    const modalOptions = [
        {
            title: 'Traduzir ao receber',
            className: 'translation-receiving',
            itemClassName: 'translation-receiving-item',
            description: (
                <div className="translation-options-container">
                    <Select
                        value={languageFrom}
                        onChange={(value, option) => {
                            setTranslationFrom(option + ' - ' + value);
                            setLanguageFrom(value);
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
                        checked={translationSending}
                        onChange={() => setTranslationSending(!translationSending)}
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
                    <Switch checked={textImprovement} onChange={setTextImprovement} />
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
                        onClick={configurateTranslation}
                        className="translation-button-save"
                    >
                        Salvar
                    </Button>,
                ]}
            >
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
