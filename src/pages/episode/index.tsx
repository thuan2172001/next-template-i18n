import React, {useEffect, useState} from 'react';
import EpisodeTemplate from '../../layout/episode';
import {useRouter} from 'next/router';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {Footer} from '@components/footer';
import {Header} from '@components/header';
import {GetUserInfo} from "src/api/auth";

const EpisodePage = (props) => {
  const router = useRouter();
  const [param, setParam] = useState({seriesId: null, episodeId: null});
  const [isCreatorMode, setCreatorMode] = useState(false);

  useEffect(() => {
    router.query && setParam({
      seriesId: router.query.serieId,
      episodeId: router.query.episodeId
    });
  }, [router.isReady, router.query])

  useEffect(() => {
    if (typeof window !== "undefined") {
      let userInfo = GetUserInfo();
      if (userInfo.role === "creator") setCreatorMode(true);
    }
  }, [GetUserInfo()]);

  return (
    <React.Fragment>
      <Header/>
      <EpisodeTemplate seriesId={param.seriesId} episodeId={param.episodeId} isCreatorMode={isCreatorMode}
      />
      <Footer/>
    </React.Fragment>
  );
};

export const getServerSideProps = async ({locale}) => (
  {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'home', 'account'])),
    },
  }
);

export default EpisodePage;
