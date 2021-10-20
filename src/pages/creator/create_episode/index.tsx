import { connect } from "react-redux";
import React,{useState} from "react";
import { Header } from "@components/header-custom";
import { Footer } from "@components/footer";
// import { CreatorLayout } from "@components/creator-tab-layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CreateEpisodeTemplate } from "src/layout/creator/create-episode";
// import { NotFoundPage } from "@components/no-result/NotFoundPage";

const CreateEpisode: React.FC = () => {
  const [leave , setLeave] = useState(false);
  const [roleValid, setRoleValid] = useState("");

  // if(roleValid === 'false') return <NotFoundPage />

  return (
    <React.Fragment>
      <Header leave = {leave} setLeave = {setLeave}/>
      {/*<CreatorLayout />*/}
      <CreateEpisodeTemplate leave = {leave} setLeave = {setLeave} setRoleValid={setRoleValid}/>
      <Footer />
    </React.Fragment>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "common",
      "home",
      "create_serie",
      "account",
    ])),
  },
});

export default connect(null, {})(CreateEpisode);
