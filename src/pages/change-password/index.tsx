import React from "react";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ChangePasswordTemplate } from "../../layout/change-password";

const ChangePassword = () => {
  return <React.Fragment>
      <ChangePasswordTemplate/>
  </React.Fragment>;
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home", "account"])),
  },
});

export default connect(null, {})(ChangePassword);
