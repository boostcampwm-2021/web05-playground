import { atom } from 'recoil';

const buildObjectState = atom({
    key: 'buildObjectState',
    default: {
        objectSrc: 'none',
        locationX: -1,
        locationY: -1,
        isLocated: false,
        isObject: false,
    },
});

export default buildObjectState;
