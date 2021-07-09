import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { connect } from "react-redux";
import React from "react";
import VerifySignUpTemplate from "../../../templates/sign-up/verify";

const VerifySignUpPage = () => {
  return <React.Fragment>{<VerifySignUpTemplate />}</React.Fragment>;
};
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home", "sign-up"])),
  },
});

export default connect(null, {})(VerifySignUpPage);
