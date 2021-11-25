/* eslint-disable no-restricted-globals */
import makeImageBitMapList from '../loadImage2';

const worker = self;
let offscreenCanvas: any;
let offscreenCtx: any;

const tileSize = 32;

const buildingImageCache = new Map();

// 빌딩만이 아니라 빌딩 + 오브젝트임
worker.onmessage = async (e) => {
    const { type, offscreen, itemList } = e.data;

    if (type === 'init') {
        offscreenCanvas = offscreen;
        offscreenCtx = offscreenCanvas.getContext('2d');

        worker.postMessage({ type: 'init offscreen' });
        return;
    }
    if (type === 'sendItemList') {
        const imageBitmapList = await makeImageBitMapList(itemList);

        let cnt = 0;
        itemList.forEach((building: any) => {
            drawOriginBuildings(building, imageBitmapList[cnt]);
            cnt += 1;
        });

        const backImage = offscreenCanvas.transferToImageBitmap();
        worker.postMessage({
            type: 'draw background',
            backImage,
        });
        return;
    }
    if (type === 'buildItem') {
        console.log('여기도 로직 추가해야한다.');
    }
    if (type === 'terminate') {
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    }
};

const drawOriginBuildings = (building: any, imageBitmap: any) => {
    const dataSize = Object.keys(building).includes('uid') ? 4 : 2;

    const buildingOutputSize = tileSize * dataSize;
    const sx = building.x * tileSize - buildingOutputSize / 2;
    const sy = building.y * tileSize - buildingOutputSize / 2;
    const dx = buildingOutputSize;
    const dy = buildingOutputSize;

    // Todo - 캐싱이미지의 경우 오프스크린에 미리 그려서 캔버스에 입히는 식으로 성능 개선을 해보자
    const cachingImage = buildingImageCache.get(imageBitmap);

    // 로직 개선해야함
    // 먼저 캐싱된거 확인 후 없으면 fetch 다음 비트맵 만들어서 그리도록
    if (cachingImage) {
        drawFunction(offscreenCtx, cachingImage, sx, sy, dx, dy);
    } else {
        drawFunction(offscreenCtx, imageBitmap, sx, sy, dx, dy);
        buildingImageCache.set(building.imageUrl, imageBitmap);
    }
};

const drawFunction = (ctx: any, img: any, sx: any, sy: any, dx: any, dy: any) => {
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, dx, dy);
};
