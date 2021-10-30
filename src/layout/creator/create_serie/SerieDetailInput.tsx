import React, { useState, useEffect } from "react";
import style from "./create-serie.module.scss";
import { Row, Form, Input, Col } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useTranslation } from "next-i18next";

export const SerieDetailInput = ({
  setTitle = null,
  setSerieSummary = null,
  setInputsValid = null,
  firstInit = true,
  currentTitle = "",
  currentSummary = "",
}) => {
  const [serieTitle, setSerieTitle] = useState(currentTitle);
  const [serieTitleErrMsg, setSerieTitleErrMsg] = useState("");

  useEffect(() => {
    setSerieTitle(currentTitle);
    setSummary(currentSummary);
  },[currentTitle, currentSummary])

  const validateSerieTitle = (value) => {
    if (value.trim() === "") setSerieTitleErrMsg("Please input series title");
    else if (value.length > 60) setSerieTitleErrMsg("Maximum 60 characters");
    else setSerieTitleErrMsg("");
  };

  const handleSerieTitleChange = (e) => {
    validateSerieTitle(e.target.value);
    const isValid = e.target.value.length <= 60;
    if (isValid) {
      setSerieTitle(e.target.value);
      setTitle({
        serieTitle: e.target.value,
      });
    } else {
      setSerieTitle(e.target.value.slice(0, 60));
      setTitle({
        serieTitle: e.target.value.slice(0, 60),
      });
    }
  };

  const [summary, setSummary] = useState(currentSummary);
  const [summaryErrMsg, setSummaryErrMsg] = useState("");

  const validateSummary = (value) => {
    if (value.length > 500) setSummaryErrMsg("Maximum 500 characters");
    else setSummaryErrMsg("");
  };

  const handleSummaryChange = (e) => {
    validateSummary(e.target.value);
    const isValid = e.target.value.length <= 500;
    if (isValid) {
      setSummary(e.target.value);
      setSerieSummary({ summary: e.target.value });
    } else {
      setSummary(e.target.value.slice(0, 500));
      setSerieSummary({ summary: e.target.value.slice(0, 500) });
    }
  };

  const [first, setFirst] = useState(true);

  useEffect(() => {
    setFirst(false);
  }, [serieTitle, summary]);

  useEffect(() => {
    if (!first || !firstInit) {
      validateSerieTitle(serieTitle);
      validateSummary(summary);
      setInputsValid({
        valid: serieTitleErrMsg === "" && summaryErrMsg === "",
      });
    }
  }, [serieTitle, summary, firstInit]);

  return (
    <Row className={`${style["serie-detail-input"]}`} gutter={30}>
      <Col span={12}>
        <Form layout="vertical">
          <Form.Item
            colon={false}
            label={<label style={{ color: "#000000" }}>Series title</label>}
            validateStatus={`${serieTitleErrMsg && "error"}`}
            help={<span>{serieTitleErrMsg}</span>}
          >
            <Input
              onChange={handleSerieTitleChange}
              placeholder="Maximum 60 characters"
              className={`${style["input"]}`}
              value={serieTitle}
            />
          </Form.Item>
        </Form>
      </Col>
      <Col span={12}>
        <Form layout="vertical">
          <Form.Item
            colon={false}
            label={
              <label style={{ color: "#000000" }}>Summary (optional)</label>
            }
            validateStatus={`${summaryErrMsg && "error"}`}
            help={<span>{summaryErrMsg}</span>}
          >
            <TextArea
              placeholder="Maximum 500 characters"
              autoSize={{ minRows: 4, maxRows: 5 }}
              onChange={handleSummaryChange}
              value={summary}
            />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
