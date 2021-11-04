import { atom } from 'recoil';

const currentWorldState = atom({
    key: 'currentWorldState',
    default: {
        wid: 1,
        name: 'default',
        port: 1,
        thumbnail: '/assets/world1',
        email: 'default',
    },
});

export default currentWorldState;
