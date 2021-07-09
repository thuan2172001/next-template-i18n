import React from "react";
import LoginTemplate from "../../templates/login";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const LoginPage = () => {
  return <React.Fragment>{<LoginTemplate />}</React.Fragment>;
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home", "account"])),
  },
});

export default connect(null, {})(LoginPage);
