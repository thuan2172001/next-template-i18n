import React, { useEffect, useState } from 'react';
import EpisodeTemplate from '../../layout/episode';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { Footer } from '@components/footer';
import { Header } from '@components/header';

const EpisodePage = (props) => {
	const router = useRouter();
	const [param, setParam] = useState({ seriesId: null, episodeId: null });

	useEffect(() => {
		router.query && setParam({
			seriesId: router.query.serieId,
			episodeId: router.query.episodeId
		});
	}, [router.isReady])

	return (
		<React.Fragment>
			<Header />
			<EpisodeTemplate seriesId={param.seriesId} episodeId={param.episodeId} />
			{/*<Footer />*/}
		</React.Fragment>
	);
};

export const getServerSideProps = async ({ locale }) => (
	{
		props: {
			...(await serverSideTranslations(locale, ['common', 'home', 'account'])),
		},
	}
);

export default EpisodePage;
