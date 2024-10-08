import { SendOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Upload, message as antdMessage } from 'antd';
import React, { useState } from 'react';
import { ChatFooterProps } from '../IChat';
import { TranslationModal } from './translation/TranslationModal';

import './ChatFooter.css';
import { WebSocketEventType } from '../../../../../utils/enum/WebSocketEventType';
import { useUser } from '../../../../../context/UserContext';
import { useHomeContext } from '../../../context/HomeContext';
import { useRequest } from '../../../../../hook/useRequest';
import { HttpMethods } from '../../../../../utils/IRequest';

export function ChatFooter({
    message, setMessage, handleSend,
    languageFrom, setLanguageFrom, translationReceiving,
    setTranslationReceiving, configurateTranslation, setTranslationFrom,
    setIsImprovingText, isImprovingText, translationFrom, scrollPage
}: ChatFooterProps) {

    const { request } = useRequest();
    const { user } = useUser();
    const { selectedConversation, stompClient } = useHomeContext();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleImageUpload = (file) => {
        setImageFile(file);
        setIsModalVisible(true);
        return false; // Impede o upload automático
    };

    const handleSendImageAndMessage = () => {
        if (!imageFile) {
            antdMessage.error('Por favor, adicione uma imagem antes de enviar.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const byteArray = new Uint8Array(reader.result as ArrayBuffer);
            handleSendRequestForImage(reader);
            setIsModalVisible(false);
            setImageFile(null);
            setModalMessage('');
        };
        reader.readAsArrayBuffer(imageFile);
    };

    const handleSendRequestForImage = (reader) => {
        if (imageFile) {
            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1]; // remove o prefixo do tipo
                const messageRequest = {
                    imageContent: base64data, // aqui é a string base64
                    imageFileName: imageFile.name,
                    senderId: user?.id,
                    receiverId: user.id === selectedConversation?.receiverId ? selectedConversation?.senderId : selectedConversation?.receiverId,
                    conversationId: selectedConversation?.id,
                    content: modalMessage,
                };

                request({
                    method: HttpMethods.POST,
                    url: '/message/send-image',
                    data: messageRequest,
                    successCallback: (data) => {
                        antdMessage.success('Mensagem enviada com sucesso!');
                    },
                    errorCallback: (error) => {
                        antdMessage.error(error);
                    }
                })
            };
            reader.readAsDataURL(imageFile);
        } else {
            antdMessage.error('Por favor, adicione uma imagem antes de enviar.');
        }
    };

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
                onPressEnter={handleSend} // Chama o método handleSend
                placeholder='Mensagem'
            />
            <Button icon={<SendOutlined />} onClick={handleSend}>
                Enviar
            </Button>

            <Upload
                beforeUpload={handleImageUpload}
                showUploadList={false}
            >
                <Button icon={<UploadOutlined />}>
                    Enviar Imagem
                </Button>
            </Upload>

            <Modal
                visible={isModalVisible}
                title="Pré-visualização da Imagem"
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSendImageAndMessage}
            >
                {imageFile && (
                    <div>
                        <img
                            src={URL.createObjectURL(imageFile)}
                            alt="Pré-visualização"
                            style={{ maxWidth: '100%', marginBottom: '10px' }}
                        />
                        <Input
                            value={modalMessage}
                            onChange={(e) => setModalMessage(e.target.value)}
                            placeholder="Adicione uma mensagem à imagem"
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
}
