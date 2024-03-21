import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const socket = new SockJS('http://localhost:8080/ws');
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
