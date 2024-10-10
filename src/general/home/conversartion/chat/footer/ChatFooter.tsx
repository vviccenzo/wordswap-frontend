import { SendOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Upload, message as antdMessage } from 'antd';
import { useState } from 'react';
import { TranslationModal } from './translation/TranslationModal';

import { useUser } from '../../../../../context/UserContext';
import { useRequest } from '../../../../../hook/useRequest';
import { HttpMethods } from '../../../../../utils/IRequest';
import { useHomeContext } from '../../../context/HomeContext';
import './ChatFooter.css';

export function ChatFooter({
    message, setMessage, handleSend,

    receivedLanguage,
    setReceivedLanguage,

    isReceivedLanguage,
    setIsReceivedLanguage,

    isImprovingText,
    setIsImprovingText,

    saveConfiguration
}) {

    const { request } = useRequest();
    const { user } = useUser();
    const { selectedConversation } = useHomeContext();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleImageUpload = (file) => {
        setImageFile(file);
        setIsModalVisible(true);

        return false;
    };

    const handleSendImageAndMessage = () => {
        if (!imageFile) {
            antdMessage.error('Por favor, adicione uma imagem antes de enviar.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
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
                isReceivedLanguage={isReceivedLanguage}
                setIsReceivedLanguage={setIsReceivedLanguage}

                receivedLanguage={receivedLanguage}
                setReceivedLanguage={setReceivedLanguage}

                isImprovingText={isImprovingText}
                setIsImprovingText={setIsImprovingText}

                saveConfiguration={saveConfiguration}
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
