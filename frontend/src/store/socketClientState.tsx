import { atom } from 'recoil';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

const socketClientState = atom<Socket<DefaultEventsMap, DefaultEventsMap> | null>({
    key: 'socketClientState',
    default: null,
});

export default socketClientState;
