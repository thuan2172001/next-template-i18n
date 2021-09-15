import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { Button, Form, Row, Col, Input, Radio, Space } from "antd";
import CustomerPaymentAPI from "../../api/customer/payment";
import { useTranslation } from "next-i18next";
import style from "./popup-add-payment-method.module.scss";

const CardSetupForm = ({ markSetupSuccess, markCancel, type }) => {
  const [cardSetupClientSecret, setCardSetupClientSecret] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [futureUsage, setFutureUsage] = useState(true);
  const [cardSetupIntent, reloadCardSetupIntent] = useState(1);
  const [checkWhiteSpace, setCheckWhiteSpace] = useState(false);

  const stripe = useStripe();

  const elements = useElements();

  const { t } = useTranslation();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window !== null &&
      window.localStorage.userInfo
    ) {
      CustomerPaymentAPI.createSetupIntent({
        userInfo: JSON.parse(window.localStorage.userInfo),
      }).then((response) => {
        const { client_secret } = response.data || response;

        setCardSetupClientSecret(client_secret);
      });
    }
  }, [cardSetupIntent]);

  const onNameChange = (e) => {
    var regEx = /^[a-zA-Z ]*$/;
    if (
      e.target.value.indexOf(" ") === 0 ||
      e.target.value.lastIndexOf(" ") === e.target.value.length - 1
    ) {
      setCheckWhiteSpace(true);
      return;
    } else {
      setCheckWhiteSpace(false);
    }
    if (e.target.value.match(regEx)) {
      setNameOnCard(e.target.value.replace(/ +(?= )/g, ""));
    } else {
      setNameOnCard("");
    }
  };

  const handleSubmit = async (event) => {
    setLoading(true);

    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const paymentMethodInfo = await stripe.confirmCardSetup(
      cardSetupClientSecret,
      {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: nameOnCard.toUpperCase(),
            email: JSON.parse(window.localStorage.userInfo).email,
          },
        },
      }
    );

    if (paymentMethodInfo.error || checkWhiteSpace) {
      setErrorMessage(t("add-payment:invalidCardInfo"));

      setLoading(false);

      markSetupSuccess(false);

      reloadCardSetupIntent(cardSetupIntent + 1);
    } else {
      CustomerPaymentAPI.addPaymentMethod({
        userInfo: JSON.parse(window.localStorage.userInfo),
        nameOnCard,
        paymentMethodInfo: paymentMethodInfo.setupIntent,
        futureUsage,
      })
        .then((response) => {
          const data = response.data || response;

          if (data.card) {
            markSetupSuccess(true);
          } else {
            setErrorMessage(t("add-payment:invalidCardInfo"));

            reloadCardSetupIntent(cardSetupIntent + 1);

            markSetupSuccess(false);
          }
        })
        .catch(() => {
          setErrorMessage(t("add-payment:invalidCardInfo"));

          reloadCardSetupIntent(cardSetupIntent + 1);

          markSetupSuccess(false);
        });

      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row>
        <Col span={24}>
          <Form.Item
            label={
              <label style={{ color: "#000000" }}>
                {t("add-payment:label.nameOnCard")}
              </label>
            }
          >
            <Input
              style={{ textTransform: "uppercase" }}
              className={`${style["stripe-element"]} ${style["name-on-card"]}`}
              onChange={(e) => onNameChange(e)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item
            label={
              <label style={{ color: "#000000" }}>
                {t("add-payment:label.cardNumber")}
              </label>
            }
          >
            <CardNumberElement className={style["stripe-element"]} />
          </Form.Item>
        </Col>
      </Row>

      <Row className={`${style["cvc-expire-row"]}`} gutter={30}>
        <Col span={12}>
          <Form.Item
            label={
              <label style={{ color: "#000000" }}>
                {t("add-payment:label.expirationDate")}
              </label>
            }
          >
            <CardExpiryElement className={style["stripe-element"]} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={<label style={{ color: "#000000" }}>CVC</label>}>
            <CardCvcElement className={style["stripe-element"]} />
          </Form.Item>
        </Col>
      </Row>

      {type === "checkOut" && (
        <Row>
          <Radio.Group
            value={futureUsage ? 1 : 0}
            onChange={() => setFutureUsage(!futureUsage)}
          >
            <Space direction="vertical">
              <Radio value={1}>Save payment method</Radio>

              <Radio value={0}>Don't save payment method</Radio>
            </Space>
          </Radio.Group>
        </Row>
      )}

      <div className={`${style["text-color-red"]}`}>{errorMessage}</div>

      <Row className={`${style["cvc-expire-row"]}`} gutter={30}>
        <Col span={12}>
          <Form.Item className={style["cancel-button"]}>
            <Button
              className={`${style["button"]} ${style["cancel-button"]}`}
              onClick={() => markCancel(true)}
            >
              {t("add-payment:cancel")}
            </Button>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item className={`${style["confirm-button"]}`}>
            <Button
              className={`${style["button"]} ${style["active-save"]}`}
              loading={isLoading}
              disabled={
                !cardSetupClientSecret ||
                !stripe ||
                nameOnCard == "" ||
                checkWhiteSpace
              }
              onClick={handleSubmit}
            >
              {t("add-payment:saveCard")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CardSetupForm;
