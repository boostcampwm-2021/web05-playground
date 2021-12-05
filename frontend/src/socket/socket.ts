/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from 'socket.io-client';

let socketClient: Socket;
const setSocket = (uri: string, port: number) => {
    socketClient = io(uri, { path: `/socket.io/${port.toString()}` });
};

export { socketClient, setSocket };
