import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { SERVER_HOST, PORT } from '@env';

const socket = new SockJS(`${SERVER_HOST}:${PORT}/ws`);
const client = Stomp.over(() => socket);

client.connect({}, () => {
   console.log('Connected');
});

client.onConnect = (frame) => {
   setConnected(true);
   console.log('Connected: ' + frame);
};

client.onWebSocketError = (error) => {
   console.error('Error with websocket', error);
};

client.onStompError = (frame) => {
   console.error('Broker reported error: ' + frame.headers['message']);
   console.error('Additional details: ' + frame.body);
};

export default client;
