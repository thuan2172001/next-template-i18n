import CryptoJS from 'crypto-js';
import {randomBytes} from 'crypto';

const secp256k1 = require('secp256k1');
const hash256 = require('hash.js');
export const SymmetricEncrypt = (data: any, key: string): string => {
	return CryptoJS.AES.encrypt(data, key).toString();
};

export const SymmetricDecrypt = (
	cipherText: string | CryptoJS.lib.CipherParams,
	key: string | CryptoJS.lib.WordArray
): string => {
	try {
		const cipher: any = CryptoJS.AES.decrypt(cipherText, key);
		return cipher?.toString(CryptoJS.enc.Utf8);
	} catch(err: any) {
		return null;
	}
};

export const GenerateKeyPair = (
	privateKey: string | null
): { publicKey: string; privateKey: string } => {
	let pK: ArrayBuffer;
	if (privateKey && typeof privateKey == 'string') {
		pK = convertStringToByteArray(privateKey);
	} else {
		do {
			pK = randomBytes(32);
		} while (!secp256k1.privateKeyVerify(pK));
	}
	const publicKey: ArrayBuffer = secp256k1.publicKeyCreate(pK);
	return {
		privateKey: convertArrayBufferToString(pK),
		publicKey: convertArrayBufferToString(publicKey),
	};
};

export const GenerateKeyPairAndEncrypt = (
	password: string
): { publicKey: string; privateKey: string; encryptedPrivateKey: string } => {
	const { privateKey, publicKey } = GenerateKeyPair(null);
	const encryptedPrivateKey = SymmetricEncrypt(privateKey, password);
	return { publicKey, privateKey, encryptedPrivateKey };
};

export const SignMessage = (privateKey: string, message: any) => {
	const signature = secp256k1.ecdsaSign(
		ConvertMessage(message),
		convertStringToByteArray(privateKey)
	);
	return convertArrayBufferToString(signature.signature);
};

export const VerifyMessage = (
	publicKey: string,
	message: string,
	signature: string
) => {
	const isValid: boolean = secp256k1.ecdsaVerify(
		convertStringToByteArray(signature),
		ConvertMessage(message),
		convertStringToByteArray(publicKey)
	);
	return isValid;
};

export const ConvertMessage = (obj: any): Uint8Array => {
	const jsonString = JSON.stringify(obj);
	const hashBytes = hash256.sha256().update(jsonString).digest();
	return Uint8Array.from(hashBytes);
};

export const convertArrayBufferToString = (
	arrayBuffer: ArrayBuffer
): string => {
	let base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
	return base64String;
};

export const convertStringToByteArray = (
	base64_string: string
): ArrayBuffer => {
	return Uint8Array.from(atob(base64_string), (c) => c.charCodeAt(0));
};

export function loginCryption(
	e_private_key: string | CryptoJS.lib.CipherParams,
	public_key: any,
	password: string
) {
	const privateKey = SymmetricDecrypt(e_private_key, password);
	SignMessage(privateKey, public_key);
	return privateKey;
}
