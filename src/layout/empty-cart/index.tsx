import style from "./empty-cart.module.scss";
import { Button } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";

export const EmptyCartTemplate = () => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <div style={{ height: 50 }} />
      <Head>
        <title>WebtoonZ | {t("common:cartItem.shoppingCart")}</title>
      </Head>
      <div className={`${style["empty-cart"]}`}>
        <img
          src="/assets/icons/empty-cart.svg"
          className={`${style["empty-cart-img"]}`}
        />
        <div className={`${style["empty-cart-content"]}`}>
          {t("common:emptyCart.noProduct")}
        </div>
        <Button onClick={() => router.push("/")} className={`${style["continue-browse"]}`}>
          {t("common:emptyCart.continueBrowse")}
        </Button>
      </div>
    </>
  );
};
