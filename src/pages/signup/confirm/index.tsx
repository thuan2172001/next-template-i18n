import React from "react";
import SignUpConfirmTemplate from "../../../templates/sign-up/confirm";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const SignUpConfirmPage = () => {
    return <React.Fragment>{<SignUpConfirmTemplate />}</React.Fragment>;
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "home", "sign-up"])),
    },
});

export default connect(null, {})(SignUpConfirmPage);