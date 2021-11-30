/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
import makeImageBitMapList from '../backgroundLoad';
import getImageBitMap from '../buildingLoad';

const worker = self;

// 월드맵
let worldOffscreenCanvas: any;
let worldOffscreenCtx: any;
let imageBitmapList: any;

// 빌딩
let buildingOffscreenCanvas: any;
let buildingOffscreenCtx: any;

let buildingBgOffscreenCanvas: any;
let buildingBgOffscreenCtx: any;
let buildingBackgroundImage: any;

let sourceX = 0;
let sourceY = 0;
let commonWidth: number;

const tileSize = 32;
const spriteTileSize = 32;

worker.onmessage = async (e) => {
    const {
        type,
        offscreen,
        layers,
        user,
        buildingOffscreen,
        buildingBgOffscreen,
        itemList,
        buildedItem,
    } = e.data;

    // 월드
    if (type === 'init') {
        worldOffscreenCanvas = offscreen;
        worldOffscreenCtx = worldOffscreenCanvas.getContext('2d');
        worker.postMessage({ msg: 'sent offscreen' });
        return;
    }
    if (type === 'sendLayer') {
        commonWidth = layers[0].width;

        imageBitmapList = await makeImageBitMapList(layers);
        drawGame(layers, user);
        worker.postMessage({ msg: 'sent LayerInfo' });
        return;
    }
    if (type === 'update') {
        if (imageBitmapList === undefined) return;
        drawGame(layers, user);
        drawObjCanvas(user);
        worker.postMessage({ msg: 'draw background by usermove' });
        return;
    }

    // 빌딩
    if (type === 'initBuilding') {
        buildingOffscreenCanvas = buildingOffscreen;
        buildingOffscreenCtx = buildingOffscreenCanvas.getContext('2d');

        buildingBgOffscreenCanvas = buildingBgOffscreen;
        buildingBgOffscreenCtx = buildingBgOffscreenCanvas.getContext('2d');

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
        await Promise.all(
            itemList.map(async (item: any) => {
                drawOriginBuildings(item, imageBitmapList[cnt]);
                cnt += 1;
            }),
        ).then(() => {
            const backImage = buildingBgOffscreenCanvas.transferToImageBitmap();
            buildingBackgroundImage = backImage;

            drawObjCanvas(user);
            worker.postMessage({
                type: 'draw background',
                backImage,
            });
        });

        return;
    }
    if (type === 'buildItem') {
        const imageBitmap = await getImageBitMap(buildedItem.imageUrl);

        buildingBgOffscreenCtx.clearRect(
            0,
            0,
            buildingBgOffscreenCanvas.width,
            buildingBgOffscreenCanvas.height,
        );
        if (buildingBackgroundImage !== undefined) {
            drawFunction(
                buildingBgOffscreenCtx,
                buildingBackgroundImage,
                0,
                0,
                buildingBgOffscreenCanvas.width,
                buildingBgOffscreenCanvas.height,
            );
        }
        drawOriginBuildings(buildedItem, imageBitmap);

        const backImage = buildingBgOffscreenCanvas.transferToImageBitmap();
        buildingBackgroundImage = backImage;
        worker.postMessage({
            type: 'draw background after build',
            backImage,
        });
        return;
    }
    if (type === 'resetBuildingBgImage') {
        buildingOffscreenCtx.clearRect(
            0,
            0,
            buildingBgOffscreenCanvas.width,
            buildingBgOffscreenCanvas.height,
        );
        buildingBackgroundImage = null;
        return;
    }

    // 공통
    if (type === 'terminate') {
        worldOffscreenCtx.clearRect(0, 0, worldOffscreenCanvas.width, worldOffscreenCanvas.height);
        buildingOffscreenCtx.clearRect(
            0,
            0,
            buildingOffscreenCtx.width,
            buildingOffscreenCtx.height,
        );
        buildingBackgroundImage = null;
        return;
    }

    worker.postMessage({ msg: 'Drawing images on offscreencanvas is finish' });
};

const drawGame = (layers: any, user: any) => {
    if (!worldOffscreenCtx) return;

    worldOffscreenCtx?.clearRect(0, 0, worldOffscreenCanvas.width, worldOffscreenCanvas.height);
    layers.forEach((layer: any) => {
        const indexOfLayers = layers.indexOf(layer);
        drawBackground(layer, indexOfLayers, user);
    });
};

const drawBackground = (layer: any, indexOfLayers: number, user: any) => {
    const width = Math.floor(worldOffscreenCanvas.width / 2);
    const height = Math.floor(worldOffscreenCanvas.height / 2);
    const dx = width - (width % tileSize);
    const dy = height - (height % tileSize);
    const layerX = user.x - dx / tileSize;
    const layerY = user.y - dy / tileSize;

    let colEnd = layer.height + layerY;
    let rowEnd = layer.width + layerX;

    if (colEnd < 0) colEnd = 0;
    if (rowEnd < 0) rowEnd = 0;
    if (colEnd > 50) colEnd = 50;
    if (rowEnd > 70) rowEnd = 70;

    if (layerY === colEnd && layerX === rowEnd) return;

    for (let col = layerY; col < colEnd; col += 1) {
        for (let row = layerX; row < rowEnd; row += 1) {
            let tileVal = layer.data[getIndex(row, col)];
            if (tileVal !== 0) {
                tileVal -= 1;
                sourceY = Math.floor(tileVal / layer.columnCount) * spriteTileSize;
                sourceX = (tileVal % layer.columnCount) * spriteTileSize;
                worldOffscreenCtx.drawImage(
                    imageBitmapList[indexOfLayers],
                    sourceX,
                    sourceY,
                    spriteTileSize,
                    spriteTileSize,
                    (row - layerX) * tileSize,
                    (col - layerY) * tileSize,
                    tileSize,
                    tileSize,
                );
            }
        }
    }
};

const getIndex = (x: number, y: number) => {
    if (x < 0) return -1;
    return y * commonWidth + x;
};

// 빌딩
const drawOriginBuildings = (building: any, imageBitmap: any) => {
    const dataSize = Object.keys(building).includes('uid') ? 4 : 2;

    const buildingOutputSize = tileSize * dataSize;
    const sx = building.x * tileSize - buildingOutputSize / 2;
    const sy = building.y * tileSize - buildingOutputSize / 2;
    const dx = buildingOutputSize;
    const dy = buildingOutputSize;

    drawFunction(buildingBgOffscreenCtx, imageBitmap, sx, sy, dx, dy);
};

const drawObjCanvas = (user: any) => {
    buildingOffscreenCtx.clearRect(
        0,
        0,
        buildingOffscreenCanvas.width,
        buildingOffscreenCanvas.height,
    );

    const { layerX, layerY } = getLayerPos(user);

    const sx = -layerX * tileSize;
    const sy = -layerY * tileSize;

    const dx = buildingBgOffscreenCanvas.width;
    const dy = buildingBgOffscreenCanvas.height;

    if (!buildingBackgroundImage) return;
    drawFunction(buildingOffscreenCtx, buildingBackgroundImage, sx, sy, dx, dy);
};

const getLayerPos = (user: any) => {
    const width = Math.floor(buildingOffscreenCanvas.width / 2);
    const height = Math.floor(buildingOffscreenCanvas.height / 2);
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
