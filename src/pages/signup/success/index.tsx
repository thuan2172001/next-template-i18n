import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {connect} from "react-redux";
import React from "react";
import SuccessSignUpTemplate from "../../../templates/sign-up/success";

const SuccessSignUpPage = () => {
    return <React.Fragment>{<SuccessSignUpTemplate />}</React.Fragment>;
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "home", "sign-up"])),
    },
});

export default connect(null, {})(SuccessSignUpPage);