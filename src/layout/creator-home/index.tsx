import { useState, useEffect } from "react";
import { Footer } from "@components/footer";
import { Header } from "@components/header";
import { HomePageCover } from "./HomePageCover";
import { CreatorNewRelease } from "./CreatorNewRelease";
// import { ThreeBoxes } from "@components/three-boxes-shop";
// import CreatorSettingAPI from "../../api/creator/setting";
// import { GetUserInfo } from "src/api/user";
import { ShopProfile } from "@components/shop-profile";

export const CreatorHomePageTemplate = () => {
  const [creatorData, setCreatorData] = useState(null);
  const [shopOpening, setOpening] = useState(true);
  const [template, setTemplate] = useState(0);

  useEffect(() => {
    getCreatorData();
  }, []);

  const getCreatorData = () => {
    // CreatorSettingAPI.getCreatorAccount({ userInfo: GetUserInfo() })
    //   .then((res) => {
    //     if (res) {
    //       setCreatorData(res);
    //       setOpening(res.shopOpening);
    //       setTemplate(res.profileTemplate);
    //       localStorage.setItem("creatorAvatar", res.avatar);
    //     }
    //   })
    //   .catch();
  };
  return (
    <>
      <Header />
      <div style={{ height: 50 }} />
      <HomePageCover creator={creatorData} />
      <CreatorNewRelease
        creatorId={creatorData?.id}
        shopOpening={shopOpening}
      />
      {/* <ShopProfile
        template={template}
        creatorId={creatorData?.id}
        isCreatorMode={true}
      /> */}
      {/* <ThreeBoxes /> */}
      <Footer />
    </>
  );
};
