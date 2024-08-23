import React from "react";

import Modal from "antd/es/modal/Modal";
import { useHomeContext } from "../../context/HomeContext.tsx";
import { Button, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export function EditUserModal() {

    const { isEditModalOpen, handleEditModalStatus } = useHomeContext();
    const [profileName, setProfileName] = React.useState('');
    const [profileEmail, setProfileEmail] = React.useState('');
    const [profilePicture, setProfilePicture] = React.useState<any>(null);
    const [fileList, setFileList] = React.useState<any>([]);

    function handleSave() {
        handleEditModalStatus(false);
    }

    function handleUploadChange({ fileList }: any) {
        setFileList(fileList);
    }

    const uploadProps = {
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Você só pode enviar arquivos JPG/PNG!');
            }

            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('A imagem deve ser menor que 2MB!');
            }

            return isJpgOrPng && isLt2M;
        },
        onChange: handleUploadChange,
        fileList,
    };

    return (
        <Modal
            title="Editar Perfil"
            open={isEditModalOpen}
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ style: { display: 'none' } }}
            onCancel={() => handleEditModalStatus(false)}
            width={300}
        >
            <div>
                <Upload {...uploadProps} listType="picture">
                    <Button icon={<UploadOutlined />}>Carregar Avatar</Button>
                </Upload>
                <Input
                    placeholder="Nome do usuário"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Input
                    placeholder="E-mail"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Button type="primary" onClick={handleSave}>Cancelar</Button>
                <Button type="primary" onClick={handleSave}>Salvar</Button>
            </div>
        </Modal>
    );
}