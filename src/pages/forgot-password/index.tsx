import React from 'react';
import ForgotPasswordTemplate from '../../layout/forgot-password';
import { connect } from 'react-redux';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ForgotPassword = () => {
  return <React.Fragment>
    {<ForgotPasswordTemplate/>}
  </React.Fragment>;
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'home', 'account'])),
  },
});

export default connect(null, {})(ForgotPassword);
