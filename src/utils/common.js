import { customAxios2 } from './custom-axios-2';
import { CONTRACT_ADDRESS, PREFIX_IMG_URL } from '../constants';
import { reduxStore } from '../store'; 
import { isAuthenticatedUser } from './auth';
import { Router } from '../translate/init';
import Web3 from 'web3'
import sotaABI from '../constants/ABI/sota.json';
import ABI from '../constants/ABI/tether.json';

const FILE_TYPE_TO_PREFIX_MIME = {
    png: 'image',

}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getBase64FromUrl = async (data) => {
    let result = await customAxios2({
        url: data.url,
        method: 'GET',
        encoding: null // This is actually important, or the image string will be encoded to the default encoding
    })

    let base64Str = result.data;

    let _urlArr = data.url.split('/')

    let defaultDataUrlPrefix = `data:image/${_urlArr[_urlArr.length - 1]};base64`

    let imageDataUrl = `${data.dataUrlPrefix || defaultDataUrlPrefix}, ${base64Str}`;
    
    return imageDataUrl;
}

const getBase64 = async (url) => {
    let obj = await (await fetch(url)).json();
      return obj;   
}

const getS3ImageUrl = (imageUrl) => {
    if (typeof(imageUrl) === 'string' && imageUrl.length > 0) {
        let _temArray = imageUrl.split('/')
        let _imageUrl = _temArray.slice(1, _temArray.length).join('/')
        
        return `${PREFIX_IMG_URL}/${_imageUrl}`
    }
    
    return null;
}

const checkIsFollowing = (authorId) => {
	return authorId ? reduxStore.getState().User?.profile?.followingUserIds.includes(authorId) : false;
}

const redirectLogin = () => {
	if(!isAuthenticatedUser()){
		Router.push('/login');
		return true
	}
	return false
}

const getBalanceWallet = async (address) => {
	const networkAddress = `${process.env.NEXT_PUBLIC_BSC_NET}`;
		const provider = new Web3.providers.HttpProvider(networkAddress);
		const web3 = new Web3(provider)

		const dataSrcBalance = {};
		// get sota balance
		const sotaCont = await new web3.eth.Contract(sotaABI, CONTRACT_ADDRESS.sota);
		let balanceSota = await sotaCont.methods.balanceOf(address).call();
		balanceSota = Web3.utils.fromWei(`${balanceSota}`, 'ether');
		dataSrcBalance.balanceSota = parseFloat(balanceSota)

		//get USDT balance
		const tether = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS.tether);
		const balanceUSDT = await tether.methods.balanceOf(address).call();
		dataSrcBalance.balanceUSDT = (balanceUSDT / Math.pow(10, 18))

		// get etherum balance
		const balanceEth = await web3.eth.getBalance(address);
		const balanceEthConv = Web3.utils.fromWei(`${balanceEth}`, 'ether');
		dataSrcBalance.balanceBNB = parseFloat(balanceEthConv)
		console.log(dataSrcBalance);
		
		return dataSrcBalance

}

const getErrorMessage = (error) =>{
	const {data} = error
    const messageError = data ? data.message.replace('.','_') : null
    return messageError
}

export {
    getS3ImageUrl,
    getBase64FromUrl,
	sleep,
	checkIsFollowing,
	redirectLogin,
	getBalanceWallet,
	getBase64,
	getErrorMessage
}