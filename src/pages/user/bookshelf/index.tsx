import React, { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Header } from "@components/header";
import { SubHeader } from "@components/sub-header";
import { Footer } from "@components/footer";
import { connect } from "react-redux";
import { BookshelfTemplate } from "../../../layout/bookshelf";
import CustomerBookshelfAPI from "../../../api/customer/bookshelf";
import { EmptyBookshelf } from "src/layout/bookshelf/EmptyBookshelf";
import { GetUserInfo } from "src/api/auth";

const Bookshelf = () => {
  const [selectedCate, setSelectedCate] = useState("all");
  const [selectedSubCate, setSelectedSubCate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    setCategoryId(selectedSubCate !== "" ? selectedSubCate : selectedCate);
  }, [selectedCate, selectedSubCate]);

  const [totalEpisode, setTotalEpisode] = useState(0);
  const [listEpisode, setList] = useState(null);

  useEffect(() => {
    CustomerBookshelfAPI.getBookShelf({
      userInfo: GetUserInfo(),
    }).then((data) => {
      console.log({ data })
      setTotalEpisode(data.length);
      setList(data);
    });
  }, [categoryId]);

  return (
    <React.Fragment>
      <Header />
      <SubHeader
        selectedCate={selectedCate}
        setSelectedCate={setSelectedCate}
      />

      <div style={{ height: 50 }}></div>

      {totalEpisode === 0 ? (
        <EmptyBookshelf />
      ) : (
        <BookshelfTemplate episodeList={listEpisode} />
      )}

      <Footer />
    </React.Fragment>
  );
};

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

export default connect(null, {})(Bookshelf);
