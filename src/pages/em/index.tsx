import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Footer } from "@components/footer";
import { Header } from "@components/header";
import EpisodeManagementTemplate from "src/layout/episode-management/index";
import { useRouter } from 'next/router';

const EpisodeManagement = () => {
  const router = useRouter();
  const [param, setParam] = useState({ serieId: null, view: router?.query.view || 'public' });
  const [roleValid, setRoleValid] = useState("");

  useEffect(() => {
    router.isReady &&
		router.query && setParam({
			serieId: router.query.serieId,
			view: router.query.view
		});
	}, [router])

  return (
    <React.Fragment>
      <Header />
      <div style={{ height: 50 }}></div>
      <EpisodeManagementTemplate serieId={param.serieId} view={param.view} setRoleValid={setRoleValid}/>
      <Footer />
    </React.Fragment>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home"])),
  },
});

export default connect(null, {})(EpisodeManagement);
