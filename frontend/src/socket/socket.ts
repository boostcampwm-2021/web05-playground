/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import io from 'socket.io-client';

let socketClient: any;
const setSocket = (uri: any) => {
    socketClient = io(uri);
};

export { socketClient, setSocket };
