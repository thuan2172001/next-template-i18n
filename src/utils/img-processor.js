import { STATUS_CODE } from '../constants';

const getBase64 = async(img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const beforeUploadImg = (
    file, 
    validations = {
        allowedImgTypes: [], 
        maxImgSize: null,
    }
) => {

    if (validations.allowedImgTypes && Array.isArray(validations.allowedImgTypes)) {

        let fileType = file.type.split('/')[1];

        let typeIsAllowed = validations.allowedImgTypes.includes(fileType)

        if (!typeIsAllowed) {
            return {
                code: STATUS_CODE.failure,
                message: {
                    i18nKey: 'message.error.imgTypeIsNotAllowed',
                    args: { imgTypes: validations.allowedImgTypes.join('/') }
                }
            }
        }
    }

    let fileSize = file.size / 1024 / 1024;
    
    if (fileSize > validations.maxImgSize) {
        return {
            code: STATUS_CODE.failure,
            message: {
                i18nKey: 'message.error.imgIsTooHeavy',
                args: { imgSize: `${validations.maxImgSize}MB` }
            }
        }
    }

    return {
        code: STATUS_CODE.success,
        message: ''
    }
}

export { 
    getBase64, 
    beforeUploadImg
};
