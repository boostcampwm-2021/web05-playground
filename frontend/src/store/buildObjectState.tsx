import { atom } from 'recoil';
import { NONE } from '../utils/constants';

const buildObjectState = atom({
    key: 'buildObjectState',
    default: {
        src: 'none',
        id: NONE,
        roomId: NONE,
        locationX: NONE,
        locationY: NONE,
        isLocated: false,
        isData: false,
    },
});

export default buildObjectState;
