import React, { useState, useEffect } from "react";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {connect} from "react-redux";
import {Header} from "@components/header";
import {SubHeader} from "@components/sub-header";
import {Footer} from "@components/footer";
import {AccountTemplate} from "../../../layout/account";

const AccountPage = () => {

    const [selectedCate, setSelectedCate] = useState("all");

    return (
        <React.Fragment>
            <Header />
            <SubHeader
                selectedCate={selectedCate}
                setSelectedCate={setSelectedCate}
            />
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