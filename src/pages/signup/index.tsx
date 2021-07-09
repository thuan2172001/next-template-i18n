import React from "react";
import SignUpTemplate from "../../templates/sign-up";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const SignUpPage = () => {
  return <React.Fragment>{<SignUpTemplate />}</React.Fragment>;
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "home", "sign-up"])),
    },
});

export default connect(null, {})(SignUpPage);