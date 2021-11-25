import React, { useState, useEffect, useMemo } from "react";
import { Button, Row, Col } from "antd";
import style from "./manage-sales.module.scss";
import { useTranslation } from "next-i18next";
import { PageNavigation } from "@components/pagination";
// import Excel from "exceljs";
// import { saveAs } from "file-saver";
import moment from "moment";

export const ManageSalesTemplate = () => {
  const { t } = useTranslation();
  const [revenue, setRevenue] = useState(0);
  const [consumptionTax, setConsumptionTax] = useState(0);
  const [revenueAfterTax, setRevenueAfterTax] = useState(0);
  const [creatorShare, SetcreatorShare] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isPmMethod, setIsPmMethod] = useState(false);
  const [disable, setDisable] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  const [page, setPage] = useState(1);
  const [isDisabledRequestNow, setIsDisabledRequestNow] = useState(false);
  const [paymentPerPage, setPaymentPerPage] = useState([]);

  useEffect(() => {
    getSaleManagement();
  }, []);

  useMemo(() => {
    if (paymentList)
      setPaymentPerPage(paymentList.slice((page - 1) * 10, page * 10));
  }, [paymentList, page]);

  useEffect(() => {
    if(isDisabledRequestNow) {
      return setDisable(true)
    }
    if (creatorShare < 2000) {
      setDisable(true);
    } else {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const nd = new Date(utc + 3600000 * 9);
      if (nd.getUTCDate() < 11 || !isPmMethod) {
        setDisable(true);
      } else setDisable(false);
    }
  }, [creatorShare, isPmMethod, isDisabledRequestNow]);

  const getSaleManagement = () => {
    // CreatorSaleManagementApi.getSaleManagement({
    //   userInfo: GetUserInfo(),
    // })
    //   .then((res) => {
    //     setPaymentList(res.listSaleRequests);
    //     setRevenue(res.revenue);
    //     setConsumptionTax(res.consumptionTax);
    //     setRevenueAfterTax(res.revenueAfterTax);
    //     SetcreatorShare(res.creatorShare);
    //     setFromDate(res.startTime);
    //     setToDate(res.finishTime);
    //     setIsPmMethod(res.isPmMethod);
    //     setIsDisabledRequestNow(res.isDisabledRequest);
    //   })
    //   .catch(() => {
    //     setRoleValid("false");
    //   });
  };

  const createPaymentRequest = () => {
    // CreatorSaleManagementApi.createPaymentRequest({
    //   userInfo: GetUserInfo(),
    // })
    //   .then((res) => {
    //     if (res) {
    //       getSaleManagement();
    //     }
    //   })
    //   .catch();
  };

  const epxortCsvData = (pmRequestId) => {
    // CreatorSaleManagementApi.exportSaleData({
    //   userInfo: GetUserInfo(),
    //   body: {
    //     pmRequestId,
    //   },
    // })
    //   .then((res) => {
    //     if (res) {
    //       downloadCsv(res.saleDetail, res.saleSummary);
    //     }
    //   })
    //   .catch();
  };

  const downloadCsv = (saleDetail, saleSummary) => {
    // const workbook = new Excel.Workbook();

    // const worksheet = workbook.addWorksheet("Sheet 1");

    // const _generateSaleSummaryTable = () => {
    //   const headers = [
    //     "Creator ID",
    //     "Export date",
    //     "Export data",
    //     "Creator's share",
    //   ];

    //   const data = Object.keys(saleSummary).map((key) => saleSummary[key]);

    //   [...Array(4).keys()]
    //     .map((e) => e + 1)
    //     .forEach((rowIndex, arrayIndex) => {
    //       worksheet.getCell(`C${rowIndex}`).value = data[arrayIndex];
    //       worksheet.getCell(`C${rowIndex}`).border = {
    //         top: { style: "thin" },
    //         left: { style: "thin" },
    //         bottom: { style: "thin" },
    //         right: { style: "thin" },
    //       };
    //       worksheet.getCell(`C${rowIndex}`).alignment = {
    //         vertical: "middle",
    //         horizontal: "right",
    //       };
    //     });

    //   [...Array(4).keys()]
    //     .map((e) => e + 1)
    //     .forEach((rowIndex, arrayIndex) => {
    //       worksheet.getCell(`B${rowIndex}`).value = headers[arrayIndex];
    //       worksheet.getCell(`B${rowIndex}`).border = {
    //         top: { style: "thin" },
    //         left: { style: "thin" },
    //         bottom: { style: "thin" },
    //         right: { style: "thin" },
    //       };
    //       worksheet.getCell(`B${rowIndex}`).fill = {
    //         type: "pattern",
    //         pattern: "solid",
    //         fgColor: { argb: "00f7caac" },
    //       };
    //     });

    //   worksheet.getColumn("B").width = 28;
    //   worksheet.getColumn("C").width = 28;
    // };

    // const _generateSaleDetailTable = () => {
    //   const headers = [
    //     "Time and date",
    //     "Buyer",
    //     "Episode ID",
    //     "Episode name",
    //     "Series ID",
    //     "Series name",
    //     "Amount",
    //     "Creator's share",
    //   ];

    //   const keys = [
    //     "date",
    //     "buyerEmail",
    //     "episodeId",
    //     "episodeName",
    //     "seriesId",
    //     "seriesName",
    //     "amount",
    //     "creatorShare",
    //   ];

    //   const data = saleDetail.map((row) => {
    //     return Object.keys(row).map((key) => row[key]);
    //   });

    //   const col = ["B", "C", "D", "E", "F", "G", "H", "I"];

    //   col.forEach((colIndex, arrayIndex) => {
    //     worksheet.getColumn(colIndex).width = 28;
    //     worksheet.getCell(`${colIndex}9`).value = headers[arrayIndex];
    //     worksheet.getCell(`${colIndex}9`).border = {
    //       top: { style: "thin" },
    //       left: { style: "thin" },
    //       bottom: { style: "thin" },
    //       right: { style: "thin" },
    //     };
    //     worksheet.getCell(`${colIndex}9`).alignment = {
    //       vertical: "middle",
    //       horizontal: "left",
    //     };
    //     worksheet.getCell(`${colIndex}9`).fill = {
    //       type: "pattern",
    //       pattern: "solid",
    //       fgColor: { argb: "00f7caac" },
    //     };
    //   });

    //   saleDetail.forEach((rowInfo, rowIndex) => {
    //     col.forEach((colIndex, arrayIndex) => {
    //       worksheet.getCell(`${colIndex}${rowIndex + 10}`).value =
    //         rowInfo[keys[arrayIndex]];
    //       worksheet.getCell(`${colIndex}${rowIndex + 10}`).border = {
    //         top: { style: "thin" },
    //         left: { style: "thin" },
    //         bottom: { style: "thin" },
    //         right: { style: "thin" },
    //       };
    //       worksheet.getCell(`${colIndex}${rowIndex + 10}`).alignment = {
    //         vertical: "middle",
    //         horizontal: "left",
    //       };
    //     });
    //   });
    // };

    // _generateSaleSummaryTable();
    // _generateSaleDetailTable();

    // saveFile(`[ARIUM]${moment().format("YYYY[-]MM[-]DD")}.xlsx`, workbook);

    // async function saveFile(fileName, workbook) {
    //   const xls64 = await workbook.xlsx.writeBuffer({ base64: true });
    //   saveAs(
    //     new Blob([xls64], {
    //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //     }),
    //     fileName
    //   );
    // }
  };

  return (
    <div className={`${style["body"]}`}>
      <div className={`${style["container"]}`}>
        <div className={`${style["hd-title"]}`}>{t("common:header.creator.manageSales")}</div>
        <div className={`${style["info-container"]}`}>
          <div className={`${style["sub-title"]}`}>Total income</div>
          <Row className={`${style["info-row"]}`}>
            <Col lg={12} className={`${style["info-col"]} ${style["price"]}`}>
              <div className={`${style["info-price"]}`}>
                USD{" "}
                <div className={`${style["price-number"]}`}>{creatorShare}</div>
              </div>
              <Button
                className={`${style["info-btn"]} ${
                  style[disable ? "disable-btn" : ""]
                }`}
                disabled={disable}
                onClick={() => {
                  createPaymentRequest();
                }}
              >
                Request payment
              </Button>
            </Col>
            <Col lg={12} className={`${style["info-col"]} ${style["table"]}`}>
              <Row className={`${style["info-item"]}`}>
                <Col className={`${style["item-label"]}`} span={11}>
                  Sale period (month)
                </Col>
                <Col span={13}>
                  Total
                </Col>
              </Row>
              <Row
                className={`${style["info-item"]} ${style["disable-border"]}`}
              >
                <Col className={`${style["item-label"]}`} span={11}>
                  January
                </Col>
                <Col span={13}>{creatorShare} USD</Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className={`${style["history-container"]}`}>
          <div className={`${style["sub-title"]}`}>Payment history</div>
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
              </tbody>
            </table>
            {paymentList?.length > 10 && (
              <PageNavigation
                totalItem={paymentList.length}
                itemsPerPage={10}
                page={page}
                setPage={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
