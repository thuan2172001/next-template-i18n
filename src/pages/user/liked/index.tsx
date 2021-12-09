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
import { useRouter } from "next/router";

const LikedBook = () => {
    const router = useRouter();
    const [selectedCate, setSelectedCate] = useState("all");
    const [selectedSubCate, setSelectedSubCate] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [totalEpisode, setTotalEpisode] = useState(-1);
    const [listEpisode, setListEpisode] = useState(null);
    const [page, setPage] = useState(1);
    const [pattern, setPattern] = useState(router.query["pattern"])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCategoryId(selectedSubCate !== "" ? selectedSubCate : selectedCate);
    }, [selectedCate, selectedSubCate]);

    useEffect(() => {
        setPattern(router.query.pattern)
    }, [router])

    useEffect(() => {
        setLoading(true);
        setPage(1);
        if (page === 1) featDataListFavor(1);
    }, [categoryId])

    useEffect(() => {
        setLoading(true);
        featDataListFavor(page);
    }, [page, pattern]);

    const featDataListFavor = (fetchPage) => {
        CustomerBookshelfAPI.getLikedBook({
            userInfo: GetUserInfo(),
            page: fetchPage,
            limit: 30,
            pattern: pattern?.toString(),
            selectedCate,
        }).then((res) => {
            setTotalEpisode(res.totalEpisodes);
            setListEpisode(res.data);
            setLoading(false);
        }).catch(err => {
            setTotalEpisode(0);
            setLoading(false);
        });
    }

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
                <FavorPageTemplate
                    episodeList={listEpisode}
                    totalEpisode={totalEpisode}
                    page={page}
                    setPage={setPage}
                    loading={loading}
                />
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
