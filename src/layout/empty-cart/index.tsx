import style from "./empty-cart.module.scss";
import { Button, Skeleton } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";

export const EmptyCartTemplate = ({ cartLoading }) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <div style={{ height: 50 }} />
      <Head>
        <title>WebtoonZ | {t("common:cartItem.shoppingCart")}</title>
      </Head>
      <div className={`${style["empty-cart"]}`}>
        <div className={`${style["cart-header"]}`}>
          {t("common:cartItem.shoppingCart")}
        </div>
        <Skeleton loading={cartLoading}>
          <img
            src="/assets/icons/empty-cart.svg"
            className={`${style["empty-cart-img"]}`}
          />
          <div className={`${style["empty-cart-content"]}`}>
            {t("common:emptyCart.noProduct")}
          </div>
        </Skeleton>
        <Button onClick={() => router.push("/")} className={`${style["continue-browse"]}`}>
          {t("common:emptyCart.continueBrowse")}
        </Button>
      </div>
    </>
  );
};
