import CryptoJS from 'crypto-js';
import { randomBytes } from 'crypto';

const secp256k1 = require('secp256k1');
const hash256 = require('hash.js');
export const SymmetricEncrypt = (data: any, key: string): string => {
	return CryptoJS.AES.encrypt(data, key).toString();
};

export const SymmetricDecrypt2 = (
	cipherText: string | CryptoJS.lib.CipherParams,
	key: string | CryptoJS.lib.WordArray
): string => {
	try {
		// git
		// cipherText = "eyJpdiI6Ik1qWmhkVzVMWW1NN1RtbDNWM3BhYlE9PSIsInZhbHVlIjoiK25KNnNWUEtkMUtoUTNydmZNNFhvUT09In0";

		// medichain
		cipherText = "U2FsdGVkX185v6FP8VEhI+Ss84zLB7oTuif/pQxnAOAXYjsPODAGuxqsPvQFbhbYkUMUH0W3vwZGdKkFSWIiiQ==";

		//episode
		// cipherText = "U2FsdGVkX19Bw6GSZZsIF4Q96pqg6xxlQFlI91E4b0Vzhnj14SMAziyXim3u6Tq565DaJ6HNv8yFxMgb3WlWbQ";

		console.log({ cipherText });

		const cipher: any = CryptoJS.AES.decrypt(cipherText, key);
		// console.log({ cipher: cipher?.toString(CryptoJS.enc.Utf8) });

		const encryptedBytesWithSalt = Buffer.from(cipherText.toString(), 'base64').toString();

		// var encryptedBytes = encryptedBytesWithSalt.subarray(16, encryptedBytesWithSalt.length);
		// var salt = encryptedBytesWithSalt.subarray(8, 16);
		// var keyndIV = deriveKeyAndIV(passphrase, salt);
		// var key = encrypt.Key(keyndIV.item1);
		// var iv = encrypt.IV(keyndIV.item2);
		console.log({ encryptedBytesWithSalt });
		console.log({ cipher });
		console.log({ cipherFormat: cipher?.toString(CryptoJS.enc.Utf8) });
		// var encrypter = encrypt.Encrypter(
		// 	CryptoJS.AES.decrypt(key, encrypt.AESMode.cbc, padding: "PKCS7"));
		// var decrypted =
		// 	encrypter.decrypt64(base64.encode(encryptedBytes), iv: iv);
		// return decrypted;

		// var s = JSON.parse(encryptedBytesWithSalt);

		// var iv = Buffer.from(s.iv, 'base64').toString();

		// var result = CryptoJS.AES.decrypt(s.value, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
		// console.log({ result: result });
		// return result;

		return cipher?.toString(CryptoJS.enc.Utf8);
	} catch (err: any) {
		console.log({ err })
		return null;
	}
};

export const SymmetricDecrypt = (
	cipherText: string | CryptoJS.lib.CipherParams,
	key: string | CryptoJS.lib.WordArray
): string => {
	try {
		// medichain
		// cipherText = "U2FsdGVkX185v6FP8VEhI+Ss84zLB7oTuif/pQxnAOAXYjsPODAGuxqsPvQFbhbYkUMUH0W3vwZGdKkFSWIiiQ==";
		// episode
		// cipherText = "U2FsdGVkX19Bw6GSZZsIF4Q96pqg6xxlQFlI91E4b0Vzhnj14SMAziyXim3u6Tq565DaJ6HNv8yFxMgb3WlWbQ";

		// encrypted Web
		// U2FsdGVkX19RVyrXQMt1Hkru3WluIi5xqjZb1eCTCuEBjW5Cd86bLTgIoS0A+9E1z1eKaFo8QykgLVQzsY2HJA==
		// encrypted Mobile
		// U2FsdGVkX185v6FP8VEhI+Ss84zLB7oTuif/pQxnAOAXYjsPODAGuxqsPvQFbhbYkUMUH0W3vwZGdKkFSWIiiQ==

		// console.log({ "encrypyed": SymmetricEncrypt("waPrrPqlvM49IbL11bWV+VYnly0SsDXrp6HYMWJv5p8=", "thuan123") });
		// console.log({ "keyPair": GenerateKeyPairAndEncrypt("abcd1234") });
		
		const cipher: any = CryptoJS.AES.decrypt(cipherText, key);
		console.log({ cipher: cipher?.toString(CryptoJS.enc.Utf8) })
		return cipher?.toString(CryptoJS.enc.Utf8);
	} catch (err: any) {
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
	try {
		const signature = secp256k1.ecdsaSign(
			ConvertMessage(message),
			convertStringToByteArray(privateKey)
		);
		return convertArrayBufferToString(signature.signature);
	} catch (err) {
		console.log(err);
	}
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
