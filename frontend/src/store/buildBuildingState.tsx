import { atom } from 'recoil';
import { NONE } from '../utils/constants';

const buildBuildingState = atom({
    key: 'buildBuildingState',
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

export default buildBuildingState;
