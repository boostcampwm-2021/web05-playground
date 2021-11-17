import { atom } from 'recoil';

const isInBuildingState = atom({
    key: 'isInBuilding',
    default: -1
});

export default isInBuildingState;
