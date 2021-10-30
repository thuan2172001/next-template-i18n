import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { appWithTranslation } from 'next-i18next';
import configureStore from '../reducers/configureStore';
import { ToastContainer } from 'react-toastify';
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import '@components/global-scss/variables.scss';
import '@components/global-scss/global.scss';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import CustomerPaymentAPI from '../api/customer/payment';

const { store, persistor } = configureStore();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const [stripeAPIKey, setStripeAPIKey] = useState(null);

	useEffect(() => {
		CustomerPaymentAPI.getApiKey().then((response) => {
			const { apiKey } = response.data || response;

			console.log({ apiKey })
			setStripeAPIKey(loadStripe(apiKey));
		});
	}, []);

	return (
		<>
			<ToastContainer />
			<Elements stripe={stripeAPIKey}>
				<Provider store={store}>
					<PersistGate persistor={persistor} loading={<>Loading</>}>
						<Component {...pageProps} />
					</PersistGate>
				</Provider>
			</Elements>
		</>
	);
}

export default appWithTranslation(MyApp);
