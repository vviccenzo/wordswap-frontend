import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useUser } from '../context/UserContext.tsx';
import { BASE_URL_WS } from '../utils/constants.ts';


const useWebSocket = (handleCallbackConversation: (messages: any[]) => void, handleStompClient: (client: any) => void, selectedConversation: any) => {
    const { token } = useUser();

    useEffect(() => {
        if (!selectedConversation) return;

        const socket = new SockJS(BASE_URL_WS);
        const client = Stomp.over(socket);

        const headers = {
            Authorization: `Bearer ${token}`
        };

        client.connect(headers, (frame: any) => {
            client.subscribe('/topic/messages/' + selectedConversation.id, (message: any) => {
                const conversationsResponse: any[] = JSON.parse(message.body);
                handleCallbackConversation(conversationsResponse);
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
    }, [token, selectedConversation]);
};

export default useWebSocket;
