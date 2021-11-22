import { atom } from 'recoil';

const deviceState = atom({
    key: 'deviceState',
    default: {
        video: true,
        voice: true,
    },
});

export default deviceState;
