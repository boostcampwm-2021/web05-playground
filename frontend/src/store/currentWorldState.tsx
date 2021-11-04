import { atom } from 'recoil';

const currentWorldState = atom({
    key: 'currentWorldState',
    default: {
        wid: 1,
        name: 'world1',
        port: 1,
        thumbnail: '/assets/world1',
        email: 'user1',
    },
});

export default currentWorldState;
