import React, { useState, useEffect } from "react";
import { Input } from "@components/input";
import { Modal, Form, Button } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { GenerateKeyPairAndEncrypt } from "src/api/auth/service/auth-cryptography";
import CustomerProfileAPI from "../../api/customer/profile";
import MailServiceApi from "../../api/mail-service/sent-mail";
import style from "./change-password.module.scss";
import { notifyError, notifySuccess } from "@components/toastify";
import Head from "next/head";

export const NewPasswordTemplate = (props) => {
  const { t } = useTranslation();

  const route = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordConvention, setPasswordConvention] = useState(false);

  const [isNewPasswordTyped, setIsNewPasswordTyped] = useState(false);
  const [isConfirmPasswordTyped, setIsConfirmPasswordTyped] = useState(false);
  const [isPasswordSubmit, setIsPasswordSubmit] = useState(false);

  const { code, user } = route.query;

  const handleChangeNewPassword = (value) => {
    setNewPassword(value);
    setIsNewPasswordTyped(true);
    validatePassword(value);
  };

  const validatePassword = (value) => {
    value.length < 8 ||
      !RegExp(".*[A-Z].*").test(value) ||
      !RegExp(".*[a-z].*").test(value) ||
      !RegExp(".*\\d.*").test(value) ||
      value != value.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ||
      /\s/.test(value)
      ? setPasswordConvention(false)
      : setPasswordConvention(true);
  };

  const handleChangeConfirmPassword = (value) => {
    setIsConfirmPasswordTyped(true);
    setConfirmPassword(value);
  };

  const handleSubmit = () => {
    const { encryptedPrivateKey, publicKey } =
      GenerateKeyPairAndEncrypt(newPassword);

    CustomerProfileAPI.confirmForgotPw({
      encryptedPrivateKey,
      publicKey,
      userId: user,
      codeId: code,
    })
      .then((data) => {
        if (!data.reason) {
          setIsPasswordSubmit(data.isResetPassword);
          notifySuccess("Change password successfully !");
          route.push('/login');
        } else {
          notifyError("Change password failed !");
        }
      })
      .catch((err) => {
        notifyError("Change password failed !");
      });
  };

  return (
    <div className={` ${style["container"]}`}>
      <div className={style['margin-top-container']}></div>
      <div className={`${style["reset-password-container"]}`}>
        <div className={`${style["signin-title"]} ${style["text-size-24"]}`}>
          {t("account:changePassword")}
        </div>

        <Form>
          <Form.Item className={`${style["reset-pw-form-item"]}`}>
            <div className={`${style["label"]}`}>New password</div>
            <Input
              type="password"
              className={`${style["atn-input-custom"]} ${style["atn-input-create-form"]}`}
              autoComplete="off"
              value={newPassword}
              name="password"
              onChange={(e) => handleChangeNewPassword(e.target.value)}
            />
          </Form.Item>

          {isNewPasswordTyped &&
            (newPassword == "" ? (
              <span
                className={`${style["reset-notify"]} ${style["text-color-red"]}`}
              >
                {t("account:emptyNewPassword")}
              </span>
            ) : passwordConvention ? (
              <></>
            ) : (
              <span
                className={`${style["reset-notify"]} ${style["text-color-red"]}`}
              >
                {t("account:newPasswordSyntax")}
              </span>
            ))}

          <Form.Item className={`${style["reset-pw-form-item"]}`}>
            <div className={`${style["label"]}`}>Confirm new password</div>
            <Input
              type="password"
              value={confirmPassword}
              className={`${style["atn-input-custom"]} ${style["atn-input-create-form"]}`}
              autoComplete="off"
              onChange={(e) => {
                handleChangeConfirmPassword(e.target.value);
              }}
            />
          </Form.Item>

          {isConfirmPasswordTyped &&
            (confirmPassword != "" ? (
              confirmPassword == newPassword ? (
                <></>
              ) : (
                <span
                  className={`${style["reset-notify"]} ${style["text-color-red"]}`}
                >
                  {t("account:confirmPasswordNotMatch")}
                </span>
              )
            ) : (
              <span
                className={`${style["reset-notify"]} ${style["text-color-red"]}`}
              >
                {t("account:emptyConfirmPassword")}
              </span>
            ))}

          <Button
            className={`${style["change-password"]}`}
            onClick={() => {
              handleSubmit();
            }}
            disabled={
              newPassword === "" ||
              confirmPassword === "" ||
              confirmPassword !== newPassword ||
              !passwordConvention
            }
          >
            <div className={`${style["title"]}`}>
              {t("account:changePassword")}
            </div>
          </Button>
        </Form>

        <Modal
          className={`${style["reset-modal"]}`}
          visible={isPasswordSubmit}
          closable={false}
          footer={false}
          maskClosable={false}
        >
          <div className={`${style["center-content"]}`}>
            <div className={`${style["success-icon"]}`}>
              <Image src="/assets/icons/success.png" height={56} width={56} />
            </div>

            <div
              className={`${style["success-message"]}`}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              {t("account:passwordReset")}
            </div>
            <Button
              type="primary"
              className={`${style["btn-login"]}`}
              onClick={() => {
                route.push("/login");
              }}
            >
              <div className={`${style["title"]}`}>{t("account:login")}</div>
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};
