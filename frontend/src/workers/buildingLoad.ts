/* eslint-disable no-return-await */
// 새로고침해도 쌓여있으려면 로컬스토리지 저장
const buildingImageCache = new Map();

const getImageBitMap = async (imgUrl: string) => {
    const cachedImg = buildingImageCache.get(imgUrl);
    if (cachedImg) {
        return cachedImg;
    }

    const response = await fetch(imgUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    buildingImageCache.set(imgUrl, imageBitmap);
    return imageBitmap;
};

export default getImageBitMap;
