import { notification } from 'antd';
import type { NotificationArgsProps } from 'antd';

// Define o tipo para a colocação da notificação
type NotificationPlacement = NotificationArgsProps['placement'];

// Função para mostrar uma notificação
export const Notification = ({
    message,
    description,
    placement,
    type
}: {
    message: string;
    description: string;
    placement: NotificationPlacement;
    type: 'success' | 'info' | 'warning' | 'error';
}) => {
    notification[type]({
        message,
        description,
        placement,
    })
};
