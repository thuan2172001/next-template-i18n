import React from "react";
import SignupTemplate from "../../layout/sign-up";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const LoginPage = () => {
    return <React.Fragment>{<SignupTemplate />}</React.Fragment>;
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "account"])),
    },
});

export default connect(null, {})(LoginPage);
