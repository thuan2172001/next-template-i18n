import React from "react";
import LoginTemplate from "../../layout/login";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const LoginPage = () => {
  return <React.Fragment>{<LoginTemplate />}</React.Fragment>;
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default connect(null, {})(LoginPage);
