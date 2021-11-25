import { connect } from "react-redux";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DocumentTemplate } from "src/layout/preview/document";

const PreviewMedia: React.FC = () => {
  return (
    <React.Fragment>
      <DocumentTemplate serieId={""} episodeId={""} />
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

export default connect(null, {})(PreviewMedia);
