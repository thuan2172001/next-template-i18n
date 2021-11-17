import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Footer } from "@components/footer";
import { Header } from "@components/header";
import { UsersManagementTemplate } from "src/layout/user-management";

const UserManagement = () => {

  return (
    <React.Fragment>
      <Header />
      <div style={{ height: 50 }}></div>
      <UsersManagementTemplate/>
      <Footer />
    </React.Fragment>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home"])),
  },
});

export default connect(null, {})(UserManagement);
