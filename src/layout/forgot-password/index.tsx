import React, { useState, useEffect } from "react";
import { Input } from "@components/input";
import { Button } from "antd";
import { useTranslation } from "next-i18next";
import CustomerProfileAPI from "../../api/customer/profile";
import style from "./forgot-password.module.scss";
import Head from "next/head";

const ForgotPasswordTemplate = (props) => {
  const { t } = useTranslation();

  const [isEmailsent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailExist, setIsEmailExist] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [countTime, setCountTime] = useState(0);

  const emailValidation = (value) => {
    setIsEmailValid(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
    );

    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([\w-]+\.)+[\w-]{2,4}$/.test(
      value
    );
  };

  const handleEmailSubmit = () => {
    setIsLoading(true);

    CustomerProfileAPI.sendEmailForgotPw({ email })
      .then((data) => {
        setIsLoading(false);
        setIsEmailSent(true);
        setIsEmailExist(true);
      })
      .catch((err) => {
        console.log(err);
        setIsEmailExist(err === "AUTH.ERROR.FORGOT_PASSWORD.MAIL_NOT_EXISTS");
        setIsLoading(false);
      });
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setCountTime(60);
    CustomerProfileAPI.sendEmailForgotPw({ email })
      .then((data) => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleChangeEmail = (value) => {
    setEmail(value);

    setIsEmailExist(true);
    emailValidation(value);
  };

  const _renderErrorMessage = () => {
    if (email === "" || email.length === 0) return null;

    if (isEmailValid) {
      if (!isEmailExist) {
        return (
          <div
            className={`${style["edit-notify"]}`}
            style={{ color: "#D13434" }}
          >
            {t("account:notExistEmail")}
          </div>
        );
      }
    }

    if (!isEmailValid)
      return (
        <div className={`${style["edit-notify"]}`}>
          {t("account:invalidEmail")}
        </div>
      );
  };

  useEffect(() => {
    if (countTime > 0) {
      setTimeout(() => {
        setCountTime(countTime - 1);
      }, 1000);
    }
  }, [countTime]);

  return (
    <div>
      {isEmailsent ? (
        <div className={`${style["login-container"]}`}>
          <div className={`${style["forgot-password-title"]}`}>
            {" "}
            {t("common:forgotPassword")}
          </div>
          <div className={`${style["detail"]}`}>
            {t("common:sentMailLink")}
            <span className={`${style["bold"]}`}>{' ' + email + '. '}</span>
            {t("common:checkMailBox")}
          </div>
          {countTime === 0 ? (
            <>
              <div className={`${style["not-receive-email"]}`}>
                {t("common:notReceiveLink2")}
                <Button 
                  type="link" 
                  className={`${style["btn-link-login"]}`}
                  onClick={() => {
                    handleResendEmail();
                  }}
                >
                  <span className={`${style["title"]}`}>
                    {t("account:resend")}
                  </span>
                </Button>
              </div>

              <div className={`${style["save-reset-password"]}`}>
                <Button
                  className={`${style["btn-login"]}`}
                  onClick={() => {
                    handleResendEmail();
                  }}
                  loading={isLoading}
                >
                  {t("account:resend")}
                </Button>
              </div>
            </>
          ) : (
            <div className={`${style["text-count-time"]}`}>
                {t('common:resendLinkMsg')} {' '}
                <div className={style["resend-in"]}>
                    {t('common:resendIn')}{' '}
                </div>
                <div className={style["count-time"]}>
                    {countTime} {' '} {t('common:seconds')}
                </div>
                
                <div className={`${style["save-reset-password"]}`}>
                  <Button
                    className={`${style["btn-login"]} ${style["disable-select"]} ${style["disable-btn"]}`}
                    loading={isLoading}
                  >
                    {t("account:resend")}
                  </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`${style["login-container"]}`}>
          <div
            className={`${style["forgot-password-title"]} ${style["text-size-24"]}`}
          >
            {" "}
            {t("common:forgotPassword")}
          </div>

          <div className={`${style["reset-password-message"]}`}>
            {t("common:forgotPasswordMessage1")}
            <br />
            {t("common:forgotPasswordMessage2")}
          </div>

          <div className={`${style["input-container"]}`}>
            <Input
              value={email}
              className={`${style["input-custom"]} ${style["input-login-form"]}`}
              placeholder="Your email address"
              autoComplete="off"
              onChange={(e) => {
                handleChangeEmail(e.target.value);
              }}
            />

            {_renderErrorMessage()}
          </div>

          <div className={`${style["save-reset-password"]}`}>
            <Button
              className={`${style["btn-login"]} ${
                style[
                  email !== "" || isEmailValid ? "save-active" : "save-deactive"
                ]
              }`}
              onClick={() => {
                handleEmailSubmit();
              }}
              loading={isLoading}
              disabled={email === "" || !isEmailValid}
            >
              {t("common:header.send")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordTemplate;
