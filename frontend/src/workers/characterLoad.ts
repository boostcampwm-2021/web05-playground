/* eslint-disable no-return-await */
const buildingImageCache = new Map();

const makeImageBitMapList = async (characters: any) => {
    const characterValues = Object.values(characters);
    const list = await Promise.all(
        characterValues.map(async (character: any) => await getImageBitMap(character.imageUrl)),
    );
    return list;
};

const getImageBitMap = async (imgUrl: string) => {
    const cachedImg = buildingImageCache.get(imgUrl);
    if (cachedImg) return cachedImg;

    const response = await fetch(imgUrl, {
        mode: 'no-cors',
        credentials: 'include',
    });
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    buildingImageCache.set(imgUrl, imageBitmap);
    return imageBitmap;
};

export default makeImageBitMapList;
