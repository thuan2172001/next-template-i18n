const STATUS_CODE = {
	success: 1,
	failure: 0,
};

const DEFAULT_COLLECTION_TYPE = 1;
const FARM_COLLECTION_TYPE = 2;

const INFURAID = "27e484dcd9e3efcfd25a83a78777cdf1";

const CONTRACT_ADDRESS = {
	tether: `${process.env.NEXT_PUBLIC_TETHER_ADDRESS}`,
	sota: `${process.env.NEXT_PUBLIC_SOTA_ADDRESS}`,
	staking: `${process.env.NEXT_PUBLIC_STAKING_ADDRESS}`,
	sotaBridge: `${process.env.NEXT_PUBLIC_SOTA_BRIDGE_ADDRESS ||
		"0x609f64E1B3b43B6Ca3456e8A2b37A45E4D8a3BDA"
		}`,
};

const USER_TYPES = {
	common: 0,
	verified: 1,
	topVerified: 2,
};

const MEDIA_TYPE = {
	video: [".mp4", ".flv", ".mov", ".m3u8", ".ts", ".3gp", ".avi", ".wmv"],
	image: [".jpeg", ".png", ".gif"],
	preview: 3,
};

const SECURITY_OPTION = {
	all: 0,
	is_2fa_enabled: 1,
	is_email_verify_enabled: 2,
	one: 3,
};

const ALLOWED_IMAGE_TYPES = ["jpg", "jpeg", "png", "gif"];
const ALLOWED_PREVIEW_IMAGE_TYPES = ["jpg", "jpeg", "png", "gif"];
const ALLOWED_IMAGE_SIZE = 30;

const DEFAULT_COLLECTION_IMG_URL =
	process.env.NEXT_PUBLIC_DEFAULT_COLLECTION_IMG_URL;
const PREFIX_IMG_URL = process.env.NEXT_PUBLIC_PREFIX_IMG_URL;

const MINIUM_STAKE_VALUE = 100;
const MAXIMUM_STAKE_VALUE = 1000;

// after INTERVAL_GET_BALANCE_DURATION miliseconds the system call get balance from contract
const INTERVAL_GET_BALANCE_DURATION = 3000;
const INTERVAL_GET_PUMPKIN_DURATION = 10000;

// after INTERVAL_CHECK_STAKE_TRANSACTION_STATUS_DURATION miliseconds the system call api check transaction status
const INTERVAL_CHECK_STAKE_TRANSACTION_STATUS_DURATION = 5000;

const MODAL_INFO = {
	success: "success",
	info: "info",
	warning: "warning",
	error: "error",
	confirm: "confirm",
};

const TRANSACTION_STATUS = {
	Fail: 0,
	Pending: 1,
	Processing: 2,
	Send: 3,
	Complete: 4,
};

const CREATING_STATUS = {
	pending: 0,
	success: 1,
};

const SALE_ACTION = {
	PutOnSale: 0,
	MakeOffer: 1,
};

const DEFAULT_CONTRACT_ID = "0xAc78567eD9F466aD454B4A13C18F550544e551C6";
const DEFAULT_ITEMS_PER_PAGE = 10;

// white list redirect for the login
const LOGIN_REDIRECT_WHITE_LIST = ["/farm-nft"];
const LOGIN_REDIRECT_KEY = "redirect";

const NO_INTERNET = "NO_INTERNET";

const HOMEPAGE_CONTENT = {
	about: Array(374).join("X"),
	notification: Array(374).join("X"),
};

export {
	STATUS_CODE,
	INFURAID,
	CONTRACT_ADDRESS,
	ALLOWED_IMAGE_TYPES,
	ALLOWED_IMAGE_SIZE,
	DEFAULT_COLLECTION_TYPE,
	FARM_COLLECTION_TYPE,
	DEFAULT_COLLECTION_IMG_URL,
	PREFIX_IMG_URL,
	USER_TYPES,
	MINIUM_STAKE_VALUE,
	MAXIMUM_STAKE_VALUE,
	INTERVAL_GET_BALANCE_DURATION,
	INTERVAL_GET_PUMPKIN_DURATION,
	INTERVAL_CHECK_STAKE_TRANSACTION_STATUS_DURATION,
	MODAL_INFO,
	TRANSACTION_STATUS,
	DEFAULT_CONTRACT_ID,
	CREATING_STATUS,
	DEFAULT_ITEMS_PER_PAGE,
	SALE_ACTION,
	LOGIN_REDIRECT_WHITE_LIST,
	LOGIN_REDIRECT_KEY,
	NO_INTERNET,
	MEDIA_TYPE,
	SECURITY_OPTION,
	ALLOWED_PREVIEW_IMAGE_TYPES,
	HOMEPAGE_CONTENT,
};
