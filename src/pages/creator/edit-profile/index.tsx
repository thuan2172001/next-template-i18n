import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { Header } from "@components/header-custom";
import { Footer } from "@components/footer";
import { CreatorLayout } from "@components/creator-tab-layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { EditProfileTemplate } from "src/layout/creator/edit-profile";
// import { NotFoundPage } from "@components/no-result/NotFoundPage";
import { GetUserInfo } from "src/api/auth";

const EditProfile: React.FC = () => {
  const [leave, setLeave] = useState(false);
  const [roleValid, setRoleValid] = useState("");

  useEffect(() => {
    let userInfo = GetUserInfo();

    if (userInfo?.role === "creator") setRoleValid("true");
    else setRoleValid("false");
  }, []);

  return (
    <React.Fragment>
      {roleValid === "" && <></>}
      {/*{roleValid === "false" && <NotFoundPage />}*/}
      {roleValid === "true" && (
        <>
          {" "}
          <Header leave={leave} setLeave={setLeave} />
          <CreatorLayout />
          <EditProfileTemplate leave={leave} setLeave={setLeave} />
          <Footer />
        </>
      )}
    </React.Fragment>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "common",
      "home",
      "create-series",
      "account",
      "shop",
    ])),
  },
});

export default connect(null, {})(EditProfile);
