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
    if (type === 'update') {
        if (imageBitmapList === undefined) return;
        drawGame(layers, user, 2);
        worker.postMessage({ msg: 'draw background by usermove' });
        return;
    }

    offscreenCanvas = offscreen;
    offscreenCtx = offscreenCanvas.getContext('2d');

    commonWidth = layers[0].width;

    imageBitmapList = await makeImageBitMapList(layers);
    drawGame(layers, user, 1);

    worker.postMessage({ msg: 'Drawing images on offscreencanvas is finish' });
};

const drawGame = (layers: any, user: any, d: number) => {
    if (!offscreenCtx) return;

    offscreenCtx?.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    layers.forEach((layer: any) => {
        const indexOfLayers = layers.indexOf(layer);
        console.log(d, indexOfLayers);
        drawBackground(layer, indexOfLayers, user);
    });
};

const drawBackground = (layer: any, indexOfLayers: number, user: any) => {
    const width = Math.floor(offscreenCanvas.width / 2);
    const height = Math.floor(offscreenCanvas.height / 2);
    const dx = width - (width % tileSize);
    const dy = height - (height % tileSize);
    let layerX = user.x - dx / tileSize;
    let layerY = user.y - dy / tileSize;

    if (layerX < 0) layerX = 0;
    if (layerY < 0) layerY = 0;
    if (layerX > 70) layerX = 70;
    if (layerY > 50) layerY = 50;

    let colEnd = layer.height + layerY;
    let rowEnd = layer.width + layerX;

    if (colEnd > 50) colEnd = 50;
    if (rowEnd > 70) rowEnd = 70;

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
    return y * commonWidth + x;
};
