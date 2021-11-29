/* eslint-disable no-return-await */
const imageMap = new Map();
imageMap.set('/assets/character1.png', 'https://jwwhhmlzueei8656692.cdn.ntruss.com/character1.png');
imageMap.set('/assets/character2.png', 'https://jwwhhmlzueei8656692.cdn.ntruss.com/character2.png');
imageMap.set('/assets/character3.png', 'https://jwwhhmlzueei8656692.cdn.ntruss.com/character3.png');

const buildingImageCache = new Map();

const makeImageBitMapList = async (characters: any) => {
    const characterValues = Object.values(characters);
    const list = await Promise.all(
        characterValues.map(async (character: any) => await getImageBitMap(character.imageUrl)),
    );
    return list;
};

const getImageBitMap = async (imgUrl: string) => {
    const convertImgUrl = imageMap.get(imgUrl);

    const cachedImg = buildingImageCache.get(imgUrl);
    if (cachedImg) return cachedImg;

    const response = await fetch(convertImgUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    buildingImageCache.set(imgUrl, imageBitmap);
    return imageBitmap;
};

export default makeImageBitMapList;
