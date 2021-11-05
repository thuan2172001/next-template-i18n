import React, { useState, useEffect } from "react";
import SerieTemplate from "../../layout/serie";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { Header } from "@components/header";
import { SubHeader } from "@components/sub-header/index";
import { Footer } from "@components/footer";

const SeriePage = () => {
  const router = useRouter();

  const { serieId } = router.query;

  return (
    <React.Fragment>
      <Header />
      <div style={{ height: 50 }}></div>
      <SerieTemplate serieId={serieId ? serieId : ""} />
      <Footer />
    </React.Fragment>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home"])),
  },
});

export default connect(null, {})(SeriePage);
