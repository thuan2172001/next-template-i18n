import { 
    DEFAULT_COLLECTION_TYPE,
    FARM_COLLECTION_TYPE,
    DEFAULT_COLLECTION_IMG_URL,
    PREFIX_IMG_URL
} from '../constants';

const isDefaultCollection = (collectionType) => {
    return collectionType === DEFAULT_COLLECTION_TYPE
}

const getCollectionImgUrl = (collectionType,collectionImageURL ) => {
    if (isDefaultCollection(collectionType) || !collectionImageURL) return DEFAULT_COLLECTION_IMG_URL;
    if (isFarmCollection(collectionType) || !collectionImageURL) return DEFAULT_COLLECTION_IMG_URL;

    let _temArray = collectionImageURL.split('/')
    let _collectionImageURL = _temArray.slice(1, _temArray.length).join('/')    
    return `${PREFIX_IMG_URL}/${_collectionImageURL}`
}

const isFarmCollection = (collectionType) => {
    return collectionType === FARM_COLLECTION_TYPE
}

export {
    getCollectionImgUrl,
    isDefaultCollection,
    isFarmCollection,
}
