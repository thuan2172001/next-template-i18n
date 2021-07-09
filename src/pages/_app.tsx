import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { appWithTranslation } from 'next-i18next';
import { AppProvider } from '../context/AppContext';
import configureStore from './configureStore';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CustomerPaymentAPI from '../api/customer/payment';
import CreatorAPI from '../api/creator/episode';
import useInterval from '@use-it/interval';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetUserInfo } from 'src/api/user';
import { notifyError, notifySuccess } from '@components/toastify';
import {SuccessPublishModal} from '@components/account/SuccessPublishModal';
import '../components/global-scss/variables.scss'

const { store, persistor } = configureStore();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const [stripeAPIKey, setStripeAPIKey] = useState(null);
	const [isNotify, setIsNotify] = useState(false);
	const [typeNoti, setTypeNoti] = useState('');
	const [isSuccessNoti, setIsSuccessNoti] = useState(false);
	const [serieIdNoti, setSerieIdNoti] = useState('');
	const [episodeIdNoti, setEpisodeIdNoti] = useState('');
	const [nameEpNoti, setNameEpNoti] = useState('');

	useInterval(() => {
		GetUserInfo() && CreatorAPI.getCreateStatus({
			userInfo: GetUserInfo()
		}).then((response) => {
			console.log(response.getStatus)
			response?.status.length > 0 && response.status.map(item => {
				console.log(item)

				if(item.name == 'checkout.payment') {
					if(item.status == 'done') {
						window.localStorage.removeItem('checkPendingPayment')
						store.dispatch({ type: 'UPDATE_CART', payload: [] })
						notifySuccess(item.name)
					}
					if(item.status == 'failed') {
						window.localStorage.removeItem('checkPendingPayment')
						notifyError(item.name)
					}
				}

				if(item.name == 'blockchain.publish' || item.name == 'blockchain.unpublish' || item.name == 'blockchain.mint' ) {
					if(item.status == 'done' || item.status == 'failed') {
						setIsNotify(true);
						setIsSuccessNoti(item.status == 'done')
						setSerieIdNoti(item.seriesId)
						setEpisodeIdNoti(item.episodeId)
						setNameEpNoti(item.epName)
						setTypeNoti(item.name == 'blockchain.publish' ? 'publish'
							: item.name == 'blockchain.mint' ? 'nft' : 'unpublish')
					}
				}
			})
		}).catch(notifyError)
	}, 5000)

	useEffect(() => {
		CustomerPaymentAPI.getApiKey().then((response) => {
			const { apiKey } = response.data || response;

			setStripeAPIKey(loadStripe(apiKey));
		});
	}, []);

	return (
		<>
			<ToastContainer />
			{isNotify &&
				<SuccessPublishModal 
					type={typeNoti} 
					isSuccess={isSuccessNoti} 
					serieId={serieIdNoti} 
					nameEp={nameEpNoti}
					episodeId={episodeIdNoti}
					setIsNotify={setIsNotify}
				/>}
			<Elements stripe={stripeAPIKey}>
				<Provider store={store}>
					<AppProvider>
						<PersistGate persistor={persistor} loading={<>Loading</>}>
							<Component {...pageProps} />
						</PersistGate>
					</AppProvider>
				</Provider>
			</Elements>
		</>
	);
}

export default appWithTranslation(MyApp);
