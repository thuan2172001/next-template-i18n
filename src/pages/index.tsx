import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { Header } from "@components/header";
import { SubHeader } from "@components/sub-header";
import { CoverPhoto } from "@components/shop_component/CoverPhoto";
import { AboutTerm } from "@components/shop_component/AboutTerm";
import { ListProducts } from "@components/shop_component/ListProducts";
import { ShopProfile } from "@components/shop-profile";
import { CreatorHomePageTemplate } from "src/layout/creator-home";
import { Footer } from "@components/footer";
import Head from "next/head";

const Home: React.FC<{ homepageContent: any }> = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [selectedCate, setSelectedCate] = useState("all");
    const [isCreatorMode, setCreatorMode] = useState(false);

    useEffect(() => {
        if (window?.localStorage.isContinueCheckout) {
            if (window.localStorage.isContinueCheckout === "true") {
                router.push("/user/cart");
            }

            window.localStorage.setItem("isContinueCheckout", "false");
        }

        if (window?.localStorage.userInfo) {
            const userInfo = JSON.parse(window.localStorage.userInfo);

            if (userInfo.role === "creator") setCreatorMode(true);
        }
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>WebtoonZ</title>
            </Head>
            <div
                style={{
                    minHeight: "100vh",
                    minWidth: "100%",
                    textAlign: "center",
                }}
            >
                {isCreatorMode ? <CreatorHomePageTemplate /> :
                    <>
                        <Header />
                        <SubHeader selectedCate={selectedCate}
                            setSelectedCate={setSelectedCate} />
                        <div style={{height: 50}}></div>
                        <CoverPhoto coverImage={"https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/74459496-fb29-42fe-940e-0be06406850e-cover1.png"} />
                        <ListProducts selectedCate={selectedCate} />
                        <ShopProfile />
                    </>
                }
                <AboutTerm coverImage={"https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/74459496-fb29-42fe-940e-0be06406850e-cover1.png"} />
                <Footer />
            </div>
        </React.Fragment>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default Home;
