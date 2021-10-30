import React, { useState, useEffect } from "react";
import SerieTemplate from "../../layout/serie";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { Header } from "@components/header";
import { SubHeader } from "@components/sub-header/index";
import { Footer } from "@components/footer";

const SeriePage = () => {
  const router = useRouter();

  const [isCreatorMode, setCreatorMode] = useState(false);
  const [selectedCate, setSelectedCate] = useState("all");
  const [selectedSubCate, setSelectedSubCate] = useState("");
  const [categoryId, setCategoryId] = useState(null);

  const { serieId } = router.query;

  return (
    <React.Fragment>
      <Header />
      <SubHeader
        selectedCate={selectedCate}
        setSelectedCate={setSelectedCate}
        categoryId={categoryId}
      />
      <div style={{ height: 50 }}></div>
      <SerieTemplate serieId={serieId ? serieId : ""} />
      <Footer />
    </React.Fragment>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home"])),
  },
});

export default connect(null, {})(SeriePage);
