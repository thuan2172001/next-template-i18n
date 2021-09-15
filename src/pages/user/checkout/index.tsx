import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {Header} from "@components/header";
// import { Footer } from "@components/footer";
import {CheckoutTemplate} from "src/layout/checkout";
import CustomerCartAPI from "../../../api/customer/cart";
import {CartTemplate} from "../../../layout/cart";

const CheckoutPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getCartList()
    }, [])

    const getCartList = () => {
        const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
        if (userInfo) {
            CustomerCartAPI.getCartData({userInfo}).then(data => {
                if (data) {
                    console.log({data})
                    setData(data)
                }
            })
        }
    }
    return (
        <React.Fragment>
            <Header/>
            <CheckoutTemplate cartList={data}/>
            {/*<Footer />*/}
        </React.Fragment>
    );
};


export const getServerSideProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            "common",
            "home",
            "add-payment",
            "account",
            "cart",
        ])),
    },
});

export default connect(null, {})(CheckoutPage);
