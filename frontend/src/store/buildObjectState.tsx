import { atom } from 'recoil';

const buildObjectState = atom({
    key: 'buildObjectState',
    default: {
        src: 'none',
        id: -1,
        locationX: -1,
        locationY: -1,
        isLocated: false,
        isData: false,
    },
});

export default buildObjectState;
