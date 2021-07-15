import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

const Home: React.FC<{ homepageContent: any }> = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <React.Fragment>
      <div
        style={{
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <img src="/assets/background.svg" style={{
          "height": "80vh",
          "marginTop": "10vh",
        }} />
      </div>
    </React.Fragment>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Home;
