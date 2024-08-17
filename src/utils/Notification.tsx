import { notification } from 'antd';
import type { NotificationArgsProps } from 'antd';

type NotificationPlacement = NotificationArgsProps['placement'];

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
