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
import Head from "next/head"
import NextNProgress from 'nextjs-progressbar';

const { store, persistor } = configureStore();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const [stripeAPIKey, setStripeAPIKey] = useState(null);

	useEffect(() => {
		CustomerPaymentAPI.getApiKey().then((response) => {
			const { apiKey } = response.data || response;
			setStripeAPIKey(loadStripe(apiKey));
		});
	}, []);

	return (
		<>
			<Head>
				<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
				<link rel="manifest" href="/assets/site.webmanifest" />
				<link rel="mask-icon" href="/assets/safari-pinned-tab.svg" color="#5bbad5" />
				<meta name="msapplication-TileColor" content="#9f00a7" />
				<meta name="theme-color" content="#ffffff" />
			</Head>
			<ToastContainer />
			<Elements stripe={stripeAPIKey}>
				<Provider store={store}>
					<PersistGate persistor={persistor} loading={
						<div style={{
							"textAlign": "center",
							"width": "100vw",
							"marginTop": "30vh"
						}}>
							<img src="/assets/icons/loading-animation.gif" />
						</div>}
					>
						<NextNProgress
							startPosition={0.3}
							height={5}
							showOnShallow={true}
						/>
						<Component {...pageProps} />
					</PersistGate>
				</Provider>
			</Elements>
		</>
	);
}

export default appWithTranslation(MyApp);
