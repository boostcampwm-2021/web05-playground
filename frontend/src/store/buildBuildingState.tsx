import { atom } from 'recoil';

const buildBuildingState = atom({
    key: 'buildBuildingState',
    default: {
        src: 'none',
        id: -1,
        locationX: -1,
        locationY: -1,
        isLocated: false,
        isData: false,
    },
});

export default buildBuildingState;
