import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useUser } from '../context/UserContext';
import { BASE_URL_WS } from '../utils/constants';
import { useHandleCallbackWS } from '../utils/ws/handleCallbackWS';
import { Notification } from '../utils/Notification';

const useWebSocket = (handleStompClient: (client: any) => void) => {
    const { token, user } = useUser();
    const { handleCallbackWS } = useHandleCallbackWS();

    useEffect(() => {
        const socket = new SockJS(BASE_URL_WS);
        const client = Stomp.over(socket);

        const headers = {
            Authorization: `Bearer ${token}`
        };

        client.connect(headers, (frame: any) => {
            client.subscribe('/topic/messages/' + user.id, (message: any) => {
                const response: any[] = JSON.parse(message.body);
                handleCallbackWS(response);
            });

            client.subscribe('/topic/errors/' + user.id, function(errorResponse) {
                const error = JSON.parse(errorResponse.body);
                Notification({ message: 'Erro', description: error.errorMessage, placement: 'top', type: 'error' });
            });

            handleStompClient(client);
        }, (error: any) => {
            console.error('Error connecting: ', error);
        });

        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, [token]);
};

export default useWebSocket;
