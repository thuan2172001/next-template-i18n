import React, { useState, useEffect, useMemo } from "react";
import style from "./transaction.module.scss";
import { PageNavigation } from "@components/pagination";
import { GetUserInfo } from "src/api/auth";
import TransactionAPI from "../../api/customer/transaction";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Head from "next/head";

export const TransactionTemplate = () => {
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [transactions, setTransactionData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { t } = useTranslation();

  const fetchData = () => {
    TransactionAPI.getAllTransactions({
      userInfo: GetUserInfo(),
      page,
      limit,
    }).then(response => {
      setTransactionData(response?.data);
      setTotalTransaction(response?.total);
    }
    ).catch(err => {
      console.log(err);
    });
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return (
    <div className={style["container"]}>
      <Head>
        <title>WebtoonZ | {t("common:transaction.title")}</title>
      </Head>
      <div className={style["header"]}>{t("common:transaction.title")}</div>
      <table className={style["table"]}>
        <thead>
          <tr style={{ fontWeight: "bold" }}>
            <th>{t("common:transaction.transactionId")}</th>
            <th>{t("common:transaction.items")}</th>
            <th>{t("common:transaction.payment")}</th>
            <th>{t("common:transaction.value")}</th>
          </tr>
        </thead>
        <tbody className={style["body"]}>
          {transactions?.map((el, index) => {
            const payment = el.payment;
            const imgSrc = payment.card.brand === "visa"
              ? "/assets/icons/visa.svg"
              : "/assets/icons/master-card.svg";
            const cardNumber = `**** **** **** ${payment.card.last4}`;
            return (
              <tr key={index}>
                <td>{el.transactionId}</td>
                <td>{el.items?.map(item => {
                  return (
                    <div>{item}</div>
                  )
                })}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                    }}
                    className={`${style["card-list"]}`}
                  >
                    <span>
                      <Image src={imgSrc} height={34} width={48} />
                    </span>

                    <span className={style["account-card-number"]}>
                      {cardNumber}
                    </span>
                  </div>
                </td>
                <td>{el.value} $</td>
              </tr>
            )
          }
          )}
        </tbody>
      </table>

      {totalTransaction > 10 && (
        <PageNavigation
          totalItem={totalTransaction}
          itemsPerPage={10}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  );
};
