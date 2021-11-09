import { atom } from 'recoil';

const selectedBuildingState = atom({
    key: 'selectedBuildingState',
    default: {
        buildingSrc: 'none',
        locationX: -1,
        locationY: -1,
        isLocated: false,
    },
});

export default selectedBuildingState;
