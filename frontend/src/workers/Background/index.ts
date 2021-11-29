/* eslint-disable no-restricted-globals */
import makeImageBitMapList from '../loadImage';

const worker = self;

let offscreenCanvas: any;
let offscreenCtx: any;
let imageBitmapList: any;

let sourceX = 0;
let sourceY = 0;
let commonWidth: number;

const tileSize = 32;
const spriteTileSize = 32;

worker.onmessage = async (e) => {
    const { type, offscreen, layers, user } = e.data;

    if (type === 'init') {
        offscreenCanvas = offscreen;
        offscreenCtx = offscreenCanvas.getContext('2d');
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
        worker.postMessage({ msg: 'draw background by usermove' });
        return;
    }
    if (type === 'terminate') {
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        return;
    }

    worker.postMessage({ msg: 'Drawing images on offscreencanvas is finish' });
};

const drawGame = (layers: any, user: any) => {
    if (!offscreenCtx) return;

    offscreenCtx?.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    layers.forEach((layer: any) => {
        const indexOfLayers = layers.indexOf(layer);
        drawBackground(layer, indexOfLayers, user);
    });
};

const drawBackground = (layer: any, indexOfLayers: number, user: any) => {
    const width = Math.floor(offscreenCanvas.width / 2);
    const height = Math.floor(offscreenCanvas.height / 2);
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
                offscreenCtx.drawImage(
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
