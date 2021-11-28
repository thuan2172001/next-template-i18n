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
import { useRouter } from "next/router";

const Bookshelf = () => {
  const router = useRouter();
  const [selectedCate, setSelectedCate] = useState("all");
  const [selectedSubCate, setSelectedSubCate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [totalEpisode, setTotalEpisode] = useState(-1);
  const [listEpisode, setList] = useState(null);
  const [page, setPage] = useState(1);
  const [pattern, setPattern] = useState(router.query["pattern"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategoryId(selectedSubCate !== "" ? selectedSubCate : selectedCate);
  }, [selectedCate, selectedSubCate]);

  useEffect(() => {
    setPattern(router.query.pattern)
  }, [router])

  useEffect(() => {
    setLoading(true);
    CustomerBookshelfAPI.getBookShelf({
      userInfo: GetUserInfo(),
      page: page,
      limit: 30,
      selectedCate,
      pattern: pattern
    }).then((res) => {
      setTotalEpisode(res.totalEpisodes);
      setList(res.data);
      setLoading(false);
    }).catch(err => {
      setTotalEpisode(0)
      setLoading(false);
    });
  }, [categoryId, page, pattern]);

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
        <BookshelfTemplate
          episodeList={listEpisode}
          totalEpisode={totalEpisode}
          page={page}
          setPage={setPage}
          loading={loading}
        />
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
