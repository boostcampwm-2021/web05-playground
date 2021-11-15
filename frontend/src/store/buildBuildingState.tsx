import { atom } from 'recoil';

const buildBuildingState = atom({
    key: 'buildBuildingState',
    default: {
        buildingSrc: 'none',
        id: -1,
        locationX: -1,
        locationY: -1,
        isLocated: false,
        isBuilding: false,
    },
});

export default buildBuildingState;
