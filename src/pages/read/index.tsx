import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReadTemplate } from "src/layout/read";

const ReadManga = (props) => {
  const router = useRouter();

  return (
    <React.Fragment>
      <ReadTemplate />
    </React.Fragment>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home", "account"])),
  },
});

export default ReadManga;
