const STATUS_CODE = {
	success: 1,
	failure: 0,
};

const USER_TYPES = {
	common: 0,
	verified: 1,
	topVerified: 2,
};

const PREFIX_IMG_URL = process.env.NEXT_PUBLIC_PREFIX_IMG_URL;

const NO_INTERNET = "NO_INTERNET";

export {
	STATUS_CODE,
	PREFIX_IMG_URL,
	USER_TYPES,
	NO_INTERNET,
};
