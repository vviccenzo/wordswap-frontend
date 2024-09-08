import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useUser } from '../context/UserContext.tsx';
import { BASE_URL_WS } from '../utils/constants.ts';
import { useHandleCallbackWS } from '../utils/handleCallbackWS.ts';


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
