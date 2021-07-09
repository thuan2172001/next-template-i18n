const API_BASE_URL = (() => {
	if (process.env.NEXT_PUBLIC_SERVER_ENDPOINT) {
		if (process.env.NEXT_PUBLIC_SERVER_ENDPOINT.charAt(0) === ':') {
			return (
				window.location.protocol +
				'//' +
				window.location.hostname +
				process.env.NEXT_PUBLIC_SERVER_ENDPOINT
			);
		}

		return process.env.NEXT_PUBLIC_SERVER_ENDPOINT;
	}

	return '/api';
})();

const BASE_URL =
	API_BASE_URL.indexOf('http') === 0
		? API_BASE_URL.split('/').slice(0, 3).join('/')
		: '';

const CREATOR = process.env.NEXT_PUBLIC_CREATOR;

module.exports = {
	API_BASE_URL,
	BASE_URL,
	CREATOR,
};
