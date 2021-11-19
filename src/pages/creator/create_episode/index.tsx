import { connect } from "react-redux";
import React,{useState} from "react";
import { Header } from "@components/header-custom";
import { Footer } from "@components/footer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CreateEpisodeTemplate } from "src/layout/creator/create-episode";

const CreateEpisode: React.FC = () => {
  const [leave , setLeave] = useState(false);
  const [roleValid, setRoleValid] = useState("");

  return (
    <React.Fragment>
      <Header leave = {leave} setLeave = {setLeave}/>
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
      "create-series",
      "account",
    ])),
  },
});

export default connect(null, {})(CreateEpisode);
