import { atom } from 'recoil';

const objectInfoState = atom({
    key: 'objectInfoState',
    default: {
        isObject: false,
        id: 0,
        bid: -1,
        x: -1,
        y: -1,
        imageUrl: '',
        fileUrl: '',
    },
});

export default objectInfoState;
