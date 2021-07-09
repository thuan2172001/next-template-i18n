import {reduxStore} from '../store';
import Web3 from "web3";
import sotaABI from "../constants/ABI/sota.json";
import {CONTRACT_ADDRESS} from "../constants";
import {convertRound} from "../common-function";
import ABI from "../constants/ABI/tether.json";
import utilitySupportAPI from "../api/utility-support";
import axios from 'axios'

const isWalletSaved = () => {
    
    return ( 
        reduxStore?.getState().User 
        && reduxStore?.getState().User.walletInfo 
        && reduxStore?.getState().User.walletInfo.walletAddress
    )
}

const getWalletAddress = () => {

    if (isWalletSaved()) return reduxStore?.getState().User.walletInfo.walletAddress;

    return null
}

const getMaxBalance = async (walletAddr) => {
    const networkAddress = `${process.env.NEXT_PUBLIC_BSC_NET}`;
    const provider = new Web3.providers.HttpProvider(networkAddress);
    const web3 = new Web3(provider)

    // get sota balance
    const sotaCont = await new web3.eth.Contract(sotaABI, CONTRACT_ADDRESS.sota);
    let balanceSota = await sotaCont.methods.balanceOf(walletAddr).call();
    balanceSota = Web3.utils.fromWei(`${balanceSota}`, 'ether');
    balanceSota = convertRound(balanceSota)

    //get USDT balance
    const tether = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS.tether);
    const balanceUSDT = await tether.methods.balanceOf(walletAddr).call();
    let usdtBalance = convertRound(balanceUSDT / Math.pow(10, 18))

    // get etherum balance
    const balanceEth = await web3.eth.getBalance(walletAddr);
    const balanceEthConv = Web3.utils.fromWei(`${balanceEth}`, 'ether');

    let newAmountBalance = {}
    newAmountBalance.maxBalanceBnb = parseFloat(convertRound(balanceEthConv));
    newAmountBalance.maxBalanceUSDT = parseFloat(usdtBalance)
    newAmountBalance.balanceSota = parseFloat(balanceSota)

    return newAmountBalance
};

const getGasPrice = async () => {
    let resConfig = await utilitySupportAPI.getConfig()
    let {data} = resConfig

    let {gasPrice, gasLimit} = data

    return gasPrice * gasLimit
}

const getSOTAPlatformsAddress = async () => {
    const url = `${process.env.NEXT_PUBLIC_COINGECKO_API}/coins/sota-finance`;
    let result = await axios.get(url);
    if (result?.data && result?.data.platforms) {
        return result.data.platforms
    }
}
const getSOTAPrice = async () => {
    const url = `${process.env.NEXT_PUBLIC_COINGECKO_API}/coins/sota-finance`;
    let result = await axios.get(url);
    if (result?.data && result?.data.tickers) {

        const sotaPlatformsAddress = getSOTAPlatformsAddress()
        const ethereumPlatformsAddress = sotaPlatformsAddress.ethereum.toUpperCase()
        for (let ticker of result.data.tickers) {
            if (ticker.base === ethereumPlatformsAddress && ticker.target === 'ETH') {
                return ticker.converted_last.usd;
            }
        }
    }
}
export { 
    isWalletSaved,
    getWalletAddress,
    getMaxBalance,
    getGasPrice,
    getSOTAPrice
}
