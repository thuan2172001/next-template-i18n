import React from "react";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {connect} from "react-redux";
import {Header} from "@components/header";
import {Footer} from "@components/footer";
import {AccountTemplate} from "../../../layout/account";

const AccountPage = () => {

    return (
        <React.Fragment>
            <Header />
            <AccountTemplate/>
            <Footer />
        </React.Fragment>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "home", "cart", "account", "add-payment"])),
    },
});

export default connect(null, {})(AccountPage);