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
                <title>WebtoonZ | Home</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
                <link rel="manifest" href="/assets/site.webmanifest" />
                <link rel="mask-icon" href="/assets/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#9f00a7" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <div
                style={{
                    minHeight: "100vh",
                    textAlign: "center",
                }}
            >
                {isCreatorMode ? <CreatorHomePageTemplate /> :
                    <>
                        <Header />
                        <SubHeader selectedCate={selectedCate}
                            setSelectedCate={setSelectedCate} />
                        <CoverPhoto coverImage={"https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/74459496-fb29-42fe-940e-0be06406850e-cover1.png"} />
                        <ListProducts selectedCate={selectedCate} />
                        <ShopProfile template={1} />
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
