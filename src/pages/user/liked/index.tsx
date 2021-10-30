import React, { useState, useEffect } from "react";
import { Header } from "@components/header";
import { SubHeader } from "@components/sub-header";
import { Footer } from "@components/footer";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {EmptyBookshelf} from "../../../layout/bookshelf/EmptyBookshelf";
import {BookshelfTemplate} from "../../../layout/bookshelf";
import CustomerBookshelfAPI from "../../../api/customer/bookshelf";
import { GetUserInfo } from "src/api/auth";


const LikedBook = () => {
    const [selectedCate, setSelectedCate] = useState("all");
    const [selectedSubCate, setSelectedSubCate] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [totalEpisode, setTotalEpisode] = useState(1);
    const [listEpisode, setListEpisode] = useState(null);

    useEffect(() => {
        setCategoryId(selectedSubCate !== "" ? selectedSubCate : selectedCate);
    }, [selectedCate, selectedSubCate]);

    useEffect(() => {
        CustomerBookshelfAPI.getLikedBook({
            userInfo: GetUserInfo(),
        }).then((data) => {
            console.log({ data })
            setTotalEpisode(data.length);
            setListEpisode(data);
        });
    }, [categoryId]);

    return (
        <React.Fragment>
            <Header />
            <SubHeader
                selectedCate={selectedCate}
                setSelectedCate={setSelectedCate}
            />

            <div style={{height: 50}}/>

            {totalEpisode === 0 ? (
                <EmptyBookshelf />
            ) : (
                <BookshelfTemplate episodeList={listEpisode} />
            )}

            <Footer />
        </React.Fragment>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            "common",
            "home",
            "cart",
            "account",
            "add-payment",
        ])),
    },
});
export default connect(null, {})(LikedBook);
