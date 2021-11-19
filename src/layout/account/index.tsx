import style from "./account.module.scss";
import { useTranslation } from "next-i18next";
import { Input, Radio, Space } from "antd";
import {
  faPen,
  faTimes,
  faSave,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import AuthService, { GetUserInfo } from "../../api/auth/index";
import { AddPaymentMethodModal } from "../checkout/AddPaymentMethodModal";
import CustomerPaymentAPI from "../../api/customer/payment";
import Head from "next/head";

export const AccountTemplate = () => {
  const { t } = useTranslation();

  const [editable, setEditable] = useState(false);
  const [modalType, setModalType] = useState("");
  const [paymentList, setPaymentList] = useState([]);

  const [profile, setProfile] = useState({
    emailAddress: "",
    username: "",
    fullName: "",
    phoneNumber: "",
    age: "",
  });

  const reFetchPayment = () => {
    CustomerPaymentAPI.getAllPaymentMethod({ userInfo: GetUserInfo() }).then(
      (response) => {
        const data = response.data || response;

        const customerPaymentList = data
          .map((method) => ({
            id: method.id,
            imgSrc:
              method.card.brand === "visa"
                ? "/assets/icons/visa.svg"
                : "/assets/icons/master-card.svg",
            name: method.card.brand === "visa" ? "Visa" : "Mastercard",
            cardNumber: `**** **** **** ${method.card.last4}`,
          }))
          .sort((a, b) => b.created - a.created);

        setPaymentList(customerPaymentList);
      }
    );
  };

  useEffect(() => {
    AuthService.getProfile({ userInfo: GetUserInfo() }).then((data) => {
      setProfile({
        ...profile,
        emailAddress: data.email,
        username: data.username,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        age: data.age,
      });
    });
    CustomerPaymentAPI.getAllPaymentMethod({ userInfo: GetUserInfo() }).then(
      (response) => {
        const data = response.data || response;

        const customerPaymentList = data
          .map((method) => ({
            id: method.id,
            imgSrc:
              method.card.brand === "visa"
                ? "/assets/icons/visa.svg"
                : "/assets/icons/master-card.svg",
            name: method.card.brand === "visa" ? "Visa" : "Mastercard",
            cardNumber: `**** **** **** ${method.card.last4}`,
          }))
          .sort((a, b) => b.created - a.created);

        const defaultPaymentMethod = customerPaymentList[0]
          ? customerPaymentList[0].id
          : "";
          
        setPaymentList(customerPaymentList);
      }
    );
  }, []);

  const handleCancelOnClick = () => {
    AuthService.getProfile({ userInfo: GetUserInfo() }).then((data) => {
      if (!data.error) {
        setProfile({
          ...profile,
          emailAddress: data.email,
          username: data.username,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          age: data.age,
        });
        setEditable(false);
      }
    });
  };

  const handleSaveOnClick = () => {
    AuthService.saveProfile({
      userInfo: GetUserInfo(),
      profile: {
        fullName: profile.fullName,
        age: profile.age,
        phoneNumber: profile.phoneNumber,
      },
    }).then((data) => {
      if (!data.error) {
        setEditable(false);
      }
    });
  };

  const onFullNameChange = (e) => {
    setProfile({
      ...profile,
      fullName: e.target.value,
    });
  };
  const onPhoneNumberChange = (e) => {
    setProfile({
      ...profile,
      phoneNumber: e.target.value,
    });
  };
  const onAgeChange = (e) => {
    setProfile({
      ...profile,
      age: e.target.value,
    });
  };

  return (
    <div className={`${style["container"]}`}>
      <Head>
        <title>WebtoonZ | {t("account:accountPage.account")}</title>
      </Head>
      <div className={`${style["big-bold"]}`}>
        {t("account:accountPage.account")}
      </div>
      <div className={`${style["sub-container"]}`}>
        <div className={`${style["section"]}`}>
          <div className={`${style["big-bold"]}`}>
            {t("account:accountPage.accountInfo")}
          </div>

          <div className={`${style["info-display"]}`}>
            <div className={`${style["field-part"]}`}>
              <div>{t("account:accountPage.emailAddress")}</div>
              <Input
                className={`${style["input"]}`}
                value={profile.emailAddress}
                disabled={true}
              />
            </div>

            <div className={`${style["field-part"]}`}>
              <div>{t("account:accountPage.username")}</div>
              <Input
                className={`${style["input"]}`}
                value={profile.username}
                disabled={true}
              />
            </div>

            <div className={`${style["field-part"]}`}>
              <div>{t("account:accountPage.fullName")}</div>
              <Input
                className={`${style["input"]}`}
                value={profile.fullName}
                disabled={!editable}
                onChange={onFullNameChange}
              />
            </div>

            <div className={`${style["field-part"]}`}>
              <div>{t("account:accountPage.phoneNumber")}</div>
              <Input
                className={`${style["input"]}`}
                value={profile.phoneNumber}
                disabled={!editable}
                onChange={onPhoneNumberChange}
              />
            </div>

            <div className={`${style["field-part"]}`}>
              <div>{t("account:accountPage.age")}</div>
              <Input
                className={`${style["input"]}`}
                value={profile.age}
                disabled={!editable}
                onChange={onAgeChange}
              />
            </div>

            <div className={`${style["button-container"]}`}>
              {editable && (
                <div
                  className={`${style["cancel-button"]}`}
                  onClick={handleCancelOnClick}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={`
                                                     ${style["icon-button"]} 
                                                     ${style["blue"]}`}
                  />
                  <div className={`${style["text-button"]}`}>
                    {t("account:accountPage.cancel")}
                  </div>
                </div>
              )}
              {!editable && (
                <div
                  className={`${style["active-white"]}`}
                  onClick={() => {
                    setEditable(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPen}
                    className={`${style["edit-pen"]}`}
                  />
                  {t("account:accountPage.edit")}
                </div>
              )}
              {editable && (
                <div
                  className={`${style["active-button"]}`}
                  onClick={handleSaveOnClick}
                >
                  <FontAwesomeIcon
                    icon={faSave}
                    className={`${style["icon-button"]} ${style["white"]}`}
                  />
                  <div className={`${style["text-button"]}`}>
                    {t("account:accountPage.save")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`${style["section"]}`}>
          <div className={`${style["big-bold"]} ${style["inline"]}`}>
            <span>{t("account:accountPage.myPaymentMethod")}</span>
            {paymentList.length > 0 && (
              <span className={`${style["ml-auto"]}`}>
                <div
                  style={{ width: '100%', fontWeight: 'normal' }}
                  className={`${style["active-button"]}`}
                  onClick={() => setModalType("addPayment")}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className={`${style["icon-button"]} ${style["white"]}`}
                  />
                  <div className={`${style["text-button"]}`}>
                    {t("account:accountPage.addNewCard")}
                  </div>
                </div>
              </span>
            )}
          </div>
          <div className={`${style["info-display"]}`}>
            {paymentList.length > 0 ? (
              <div>
                {paymentList.map((el, index) => {
                  return (
                    <div className={`${style["card-list"]}`}>
                      <span>
                        <Image src={el.imgSrc} height={34} width={48} />
                      </span>

                      <span className={style["account-card-name"]}>
                        {el.name}
                      </span>

                      <span className={style["account-card-number"]}>
                        {el.cardNumber}
                      </span>

                      <span
                        className={style["remove"]}
                        onClick={() => {
                          let ok = window.confirm(
                            "Are you sure want to delete this payment method?"
                          );
                          if (ok) {
                            CustomerPaymentAPI.deletePaymentMethod({
                              userInfo: JSON.parse(
                                window.localStorage.userInfo
                              ),
                              paymentMethodID: el.id,
                            }).then(() => {
                              reFetchPayment();
                            });
                          }
                        }}
                      >
                        {t("account:accountPage.remove")}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className={`${style["active-button"]}`}
                onClick={() => setModalType("addPayment")}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className={`${style["icon-button"]} ${style["white"]}`}
                />
                <div className={`${style["text-button"]}`}>
                  {t("account:accountPage.addNewCard")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalType === "addPayment" && (
        <AddPaymentMethodModal
          type={modalType}
          updateModalVisible={setModalType}
          setReload={(value) => value && reFetchPayment()}
        />
      )}
    </div>
  );
};
