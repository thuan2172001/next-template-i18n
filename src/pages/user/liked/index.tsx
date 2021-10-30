import React, { useState, useEffect } from "react";
import { Header } from "@components/header";
import { SubHeader } from "@components/sub-header";
import { Footer } from "@components/footer";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CustomerBookshelfAPI from "../../../api/customer/bookshelf";
import { GetUserInfo } from "src/api/auth";
import { EmptyFavorItem } from "src/layout/favorItem/FavorItem";
import { FavorPageTemplate } from "src/layout/favorItem";

const LikedBook = () => {
    const [selectedCate, setSelectedCate] = useState("all");
    const [selectedSubCate, setSelectedSubCate] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [totalEpisode, setTotalEpisode] = useState(0);
    const [listEpisode, setListEpisode] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setCategoryId(selectedSubCate !== "" ? selectedSubCate : selectedCate);
    }, [selectedCate, selectedSubCate]);

    useEffect(() => {
        CustomerBookshelfAPI.getLikedBook({
            userInfo: GetUserInfo(),
            page,
            limit: 30,
        }).then((res) => {
            setTotalEpisode(res.totalEpisodes);
            setListEpisode(res.data);
        });
    }, [categoryId, page]);

    return (
        <React.Fragment>
            <Header />
            <SubHeader
                selectedCate={selectedCate}
                setSelectedCate={setSelectedCate}
            />

            <div style={{ height: 50 }} />

            {totalEpisode === 0 ? (
                <EmptyFavorItem />
            ) : (
                <FavorPageTemplate episodeList={listEpisode} totalEpisode={totalEpisode} page={page} setPage={setPage} />
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
