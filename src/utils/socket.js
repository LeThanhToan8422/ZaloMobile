import { io } from 'socket.io-client';
import { SERVER_HOST } from '@env';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = 'https://zalo-backend-team-6.onrender.com';

export const socket = io(SERVER_HOST);
