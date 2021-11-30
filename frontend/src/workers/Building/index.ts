/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-await */
/* eslint-disable no-restricted-globals */
import getImageBitMap from '../buildingLoad';

const worker = self;
let offscreenCanvas: any;
let offscreenCtx: any;

let bgOffscreenCanvas: any;
let bgOffscreenCtx: any;
let backgroundImage: any;

const tileSize = 32;

// 빌딩만이 아니라 빌딩 + 오브젝트임
worker.onmessage = async (e) => {
    const { type, offscreen, bgOffscreen, itemList, buildedItem, user } = e.data;

    if (type === 'init') {
        offscreenCanvas = offscreen;
        offscreenCtx = offscreenCanvas.getContext('2d');

        bgOffscreenCanvas = bgOffscreen;
        bgOffscreenCtx = bgOffscreenCanvas.getContext('2d');

        worker.postMessage({ type: 'init offscreen' });
        return;
    }
    if (type === 'sendItemList') {
        const imageBitmapList: any = [];
        for await (const item of itemList) {
            const bitMap = await getImageBitMap(item.imageUrl);
            imageBitmapList.push(bitMap);
        }

        let cnt = 0;
        itemList.forEach((building: any) => {
            drawOriginBuildings(building, imageBitmapList[cnt]);
            cnt += 1;
        });

        const backImage = bgOffscreenCanvas.transferToImageBitmap();
        backgroundImage = backImage;

        drawObjCanvas(user);
        worker.postMessage({
            type: 'draw background',
            backImage,
        });
        return;
    }
    if (type === 'update') {
        drawObjCanvas(user);
        worker.postMessage({
            type: 'update background',
        });
        return;
    }
    if (type === 'buildItem') {
        const imageBitmap = await getImageBitMap(buildedItem.imageUrl);

        bgOffscreenCtx.clearRect(0, 0, bgOffscreenCanvas.width, bgOffscreenCanvas.height);
        if (backgroundImage !== undefined) {
            drawFunction(
                bgOffscreenCtx,
                backgroundImage,
                0,
                0,
                bgOffscreenCanvas.width,
                bgOffscreenCanvas.height,
            );
        }
        drawOriginBuildings(buildedItem, imageBitmap);

        const backImage = bgOffscreenCanvas.transferToImageBitmap();
        backgroundImage = backImage;
        worker.postMessage({
            type: 'draw background after build',
            backImage,
        });
        return;
    }
    if (type === 'terminate') {
        bgOffscreenCtx.clearRect(0, 0, bgOffscreenCanvas.width, bgOffscreenCanvas.height);
    }
};

const drawOriginBuildings = (building: any, imageBitmap: any) => {
    const dataSize = Object.keys(building).includes('uid') ? 4 : 2;

    const buildingOutputSize = tileSize * dataSize;
    const sx = building.x * tileSize - buildingOutputSize / 2;
    const sy = building.y * tileSize - buildingOutputSize / 2;
    const dx = buildingOutputSize;
    const dy = buildingOutputSize;

    drawFunction(bgOffscreenCtx, imageBitmap, sx, sy, dx, dy);
};

const drawObjCanvas = (user: any) => {
    offscreenCtx?.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    const { layerX, layerY } = getLayerPos(user);

    const sx = -layerX * tileSize;
    const sy = -layerY * tileSize;

    const dx = bgOffscreenCanvas.width;
    const dy = bgOffscreenCanvas.height;
    if (!backgroundImage) return;
    drawFunction(offscreenCtx, backgroundImage, sx, sy, dx, dy);
};

const getLayerPos = (user: any) => {
    const width = Math.floor(offscreenCanvas.width / 2);
    const height = Math.floor(offscreenCanvas.height / 2);
    const dx = width - (width % tileSize);
    const dy = height - (height % tileSize);
    const layerX = user.x! - dx / tileSize;
    const layerY = user.y! - dy / tileSize;

    return { layerX, layerY };
};

const drawFunction = (ctx: any, img: any, sx: any, sy: any, dx: any, dy: any) => {
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, dx, dy);
};
