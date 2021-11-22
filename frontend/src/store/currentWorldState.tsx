import { atom } from 'recoil';

const currentWorldState = atom({
    key: 'currentWorldState',
    default: {
        id: 1,
        uid: 1,
        name: 'default',
        port: 1,
        thumbnail: '/assets/world1',
    },
});

export default currentWorldState;
