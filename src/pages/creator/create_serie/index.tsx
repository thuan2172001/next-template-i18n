import { connect } from "react-redux";
import React,{useState} from "react";
import { Header } from "@components/header-custom";
import { Footer } from "@components/footer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CreateSerieTemplate } from "src/layout/creator/create_serie";

const CreateSerie: React.FC = () => {
  const [leave , setLeave] = useState(false);
  return (
    <React.Fragment>
      <Header  leave = {leave} setLeave = {setLeave}/>
      <div style={{ height: 50 }}></div>
      <CreateSerieTemplate leave = {leave} setLeave = {setLeave}/>
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

export default connect(null, {})(CreateSerie);
