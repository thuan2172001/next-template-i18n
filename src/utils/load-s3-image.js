import { customAxios2 } from '../utils/custom-axios-2';

export function getS3BinaryImage(url) {
    return customAxios2(url, {
            method: 'GET',
        })
        .then((response) => {
            if (response.code !== 0) {
                return Buffer.from(response.data, 'binary')
            }
        });
}

export const getPreviewImage = async (url) => {
    return await customAxios2({
        method: 'get',
        url: url
    })
}
