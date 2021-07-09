import { 
    PREFIX_IMG_URL
} from '../constants';

const getNFTImageUrl = (NFTImageURL) => {
    let _temArray = NFTImageURL.split('/')
    let _NFTImageURL = _temArray.slice(1, _temArray.length).join('/')
    
    return `${PREFIX_IMG_URL}/${_NFTImageURL}`
}

const getNFTImageName = (imgFile) => {
    let { type } = imgFile;
    let name = new Date().getTime();
    let extension = type.split('/')[1];

    return `${name}.${extension}`;
}

const getNFTVideoName = (imgFile) => {
    let type = imgFile.name;
    let name = new Date().getTime();
    let result = type.split(".");
    console.log(result)
    return `${name}.${result[result.length -1]}`;
}

export {
    getNFTImageUrl,
    getNFTImageName,
    getNFTVideoName
}
