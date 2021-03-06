import React, { useState, useEffect, useMemo } from "react";
import { Button, Row, Col } from "antd";
import style from "./manage-sales.module.scss";
import { useTranslation } from "next-i18next";
import { PageNavigation } from "@components/pagination";
import CreatorAPI from "../../../api/creator/profile";
import { GetUserInfo } from "src/api/auth";
import Head from "next/head";
import { NoResult } from "../create_serie/preview/NoResult";

export const ManageSalesTemplate = () => {
  const { t } = useTranslation();
  const [creatorShare, setCreatorShare] = useState(0);
  const [transactions, setTransaction] = useState([]);
  const [monthSales, setMonthSales] = useState([]);
  const [page, setPage] = useState(1);
  const [totalTransaction, setTotal] = useState(-1);
  const [refetch, setRefetch] = useState(false);

  const saveAs = (data, filename) => {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=urf-8,' + encodeURIComponent(data));
    pom.setAttribute('download', filename);
    pom.click();
  };

  const exportData = () => {
    CreatorAPI.getExportData({
      userInfo: GetUserInfo()
    }).then(data => {
      console.log(data);
      generateCSV(data);
    }).catch(console.log)
  }

  const generateCSV = (data: any) => {
    if (data.length <= 0) return;
    const keys = Object.keys(data[0]);
    let file = keys.join(',') + '\n';
    data.forEach(element => {
      const line = Object.keys(element).map(key => {
        if (key === 'items') {
          return element[key].join(' - ');
        }
        return element[key];
      }).join(',');
      file = file + line + '\n';
    });
    saveAs(
      file,
      'Webtoonz-transactions.csv'
    );
  }

  useEffect(() => {
    CreatorAPI.getTotalSale({
      userInfo: GetUserInfo(),
    }).then(data => {
      setCreatorShare(data.total);
      setMonthSales(data.monthSales);
    }).catch(console.log)

    CreatorAPI.getAllTransaction({
      userInfo: GetUserInfo(),
      page: page,
      limit: 10,
    }).then(data => {
      setTransaction(data.data);
      setTotal(data.total);
    }).catch(console.log)

  }, [refetch])

  return (
    <div className={`${style["body"]}`}>
      <Head>
        <title>WebtoonZ | {t("common:header.creator.manageSales")}</title>
      </Head>
      <div className={`${style["container"]}`}>
        <div className={`${style["hd-title"]}`}>{t("common:header.creator.manageSales")}</div>
        <div className={`${style["info-container"]}`}>
          <div className={`${style["sub-title"]}`}>{t("common:totalIncome")}</div>
          <Row className={`${style["info-row"]}`}>
            <Col lg={12} className={`${style["info-col"]} ${style["price"]}`}>
              <div className={`${style["info-price"]}`}>
                <div className={`${style["price-number"]}`}>{creatorShare}</div>
                USD{" "}
              </div>
              <Button
                className={`${style["info-btn"]}`}
                onClick={() => exportData()}
              >
                {t("common:export")}
              </Button>
            </Col>
            <Col lg={12} className={`${style["info-col"]} ${style["table"]}`}>
              <Row className={`${style["info-item"]}`}>
                <Col className={`${style["item-label"]}`} span={11}>
                  {t("common:salePeriodPerMonth")}
                </Col>
                <Col span={13}>
                  {t("common:total")}
                </Col>
              </Row>
              <Row
                className={`${style["info-item"]} ${style["disable-border"]}`}
              >
                {monthSales.map((monthSale, i) => {
                  return (
                    <>
                      <Col className={`${style["item-label"]}`} span={11}>
                        {t(`common:month.${i + 1}`)}
                      </Col>
                      <Col span={13}>{monthSale} USD</Col>
                    </>
                  )
                })}
              </Row>
            </Col>
          </Row>
        </div>
        <div className={`${style["history-container"]}`}>
          <div className={`${style["sub-title"]}`}>
            {t("common:transactionHistory")}
          </div>
          {transactions && transactions?.length > 0 ?
            <div className={style["table-container"]}>
              <table className={style["table"]}>
                <thead>
                  <tr>
                    <th>{t("common:transaction.transactionId")}</th>
                    <th>{t("common:transaction.username")}</th>
                    <th>{t("common:transaction.items")}</th>
                    <th>{t("common:transaction.value")}</th>
                  </tr>
                </thead>
                <tbody className={style["body"]}>
                  {transactions?.map((el, index) => {
                    return (
                      <tr key={index}>
                        <td>{el?.transactionId}</td>
                        <td>{el?.user.username}</td>
                        <td>{el?.items?.map(item => {
                          return (
                            <div>{item}</div>
                          )
                        })}</td>
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
            </div> : <NoResult />}
        </div>
      </div>
    </div>
  );
};
