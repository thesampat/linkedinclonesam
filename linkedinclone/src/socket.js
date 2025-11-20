import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_ENV === 'production' ? undefined : import.meta.env.VITE_SERVER_URL;

export const socket = io(URL);