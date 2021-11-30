/* eslint-disable no-restricted-globals */
import { IUser } from '../../utils/model';
import makeImageBitMapList from '../characterLoad';

const worker = self;

let offscreenCanvas: any;
let offscreenCtx: any;
let imageBitmapList: any;

const characterWidth = 32;
const characterHeight = 64;

let backgroundWidth: any;
let backgroundHeight: any;

const directionInteval = 32 * 3;
const cycle = 8;

worker.onmessage = async (e) => {
    const { type, offscreen, characters, user, width, height } = e.data;

    if (type === 'init') {
        offscreenCanvas = offscreen;
        offscreenCtx = offscreenCanvas.getContext('2d');
        backgroundWidth = width;
        backgroundHeight = height;
        worker.postMessage({ msg: 'sent offscreen' });
        return;
    }
    if (type === 'update') {
        imageBitmapList = await makeImageBitMapList(characters);
        draw(characters, user, imageBitmapList);
        worker.postMessage({ msg: 'draw character by usermove' });
        return;
    }
    if (type === 'terminate') {
        offscreenCtx.clearRect(0, 0, backgroundWidth, backgroundHeight);
    }
};
const draw = (characters: any, user: any, imageBitmapList: any) => {
    offscreenCtx.clearRect(0, 0, backgroundWidth, backgroundHeight);
    const width = Math.floor(window.innerWidth / 2);
    const height = Math.floor(window.innerHeight / 2);
    const dx = width - (width % characterWidth);
    const dy = height - (height % characterWidth);

    let cnt = 0;
    Object.keys(characters).forEach((id) => {
        const character = characters[id];
        const characterImg = imageBitmapList[cnt];
        if (id === user.id.toString()) {
            // my-Char
            offscreenCtx.drawImage(
                characterImg,
                getPoseCharacter(character),
                0,
                characterWidth,
                characterHeight,
                dx,
                dy,
                characterWidth,
                characterHeight,
            );
        } else if (character.isInBuilding === user.isInBuilding) {
            // other-Char
            const distanceX = (character.x! - user.x!) * characterWidth;
            const distanceY = (character.y! - user.y!) * characterWidth;

            offscreenCtx.drawImage(
                characterImg,
                getPoseCharacter(character),
                0,
                characterWidth,
                characterHeight,
                dx + distanceX,
                dy + distanceY,
                characterWidth,
                characterHeight,
            );
        }
        cnt += 1;
    });
};

const getPoseCharacter = (character: IUser) => {
    if (character.direction === undefined) return 0;
    if (character.toggle === undefined) return character.direction * directionInteval;
    return (
        character.direction * directionInteval +
        (Math.floor(character.toggle / (cycle / 2)) + 1) * characterWidth
    );
};
