import React from "react";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NewPasswordTemplate } from "../../layout/reset-password";

const ForgotPassword = () => {
  return <React.Fragment>
      <NewPasswordTemplate/>
  </React.Fragment>;
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home", "account"])),
  },
});

export default connect(null, {})(ForgotPassword);
