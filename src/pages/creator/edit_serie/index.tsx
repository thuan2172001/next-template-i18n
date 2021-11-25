import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { Header } from "@components/header-custom";
import { Footer } from "@components/footer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { EditSerieTemplate } from "src/layout/creator/edit-serie";
import { useRouter } from "next/router";
import { GetUserInfo } from "src/api/auth";

const EditSerie: React.FC = () => {
  const router = useRouter();
  const [param, setParam] = useState({ serieId: null });
  const [leave, setLeave] = useState(false);

  useEffect(() => {
    router.isReady &&
      router.query &&
      setParam({
        serieId: router.query.serieId,
      });
  }, [router.isReady]);

  return (
    <React.Fragment>
      <Header leave={leave} setLeave={setLeave} />
      <div style={{ height: 50 }}></div>
      <EditSerieTemplate
        seriesId={param.serieId}
        leave={leave}
        setLeave={setLeave}
      />
      <Footer />
    </React.Fragment>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "common",
      "home",
      "create-series",
      "account",
    ])),
  },
});

export default connect(null, {})(EditSerie);
