import { useState, useEffect } from "react";
import { Footer } from "@components/footer";
import { Header } from "@components/header";
import { HomePageCover } from "./HomePageCover";
import { CreatorNewRelease } from "./CreatorNewRelease";
// import { ThreeBoxes } from "@components/three-boxes-shop";
// import CreatorSettingAPI from "../../api/creator/setting";
import { GetUserInfo } from "src/api/auth";
import { ShopProfile } from "@components/shop-profile";
import { CoverPhoto } from "@components/shop_component/CoverPhoto";

export const CreatorHomePageTemplate = () => {
  const [creatorData, setCreatorData] = useState(null);
  const [shopOpening, setOpening] = useState(true);
  const [template, setTemplate] = useState(0);

  useEffect(() => {
    getCreatorData();
  }, []);

  const getCreatorData = () => {
    const userInfo = GetUserInfo()
    setCreatorData(userInfo)
  };

  return (
    <>
      <Header />
      <div style={{ height: 50 }} />
      <CoverPhoto coverImage={"https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/74459496-fb29-42fe-940e-0be06406850e-cover1.png"} />
      <CreatorNewRelease
        creatorId={creatorData?.id}
        shopOpening={shopOpening}
      />
      <ShopProfile
        template={1}
      />
    </>
  );
};
