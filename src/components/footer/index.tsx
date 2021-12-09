import React from "react";
import { Button, Space } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import style from "./footer.module.scss";

export const Footer = ({ isHide = false }) => {
    const { t } = useTranslation();
    const router = useRouter();

    if (isHide) return <></>;

    return (
        <div className={`${style["atn-footer"]}`}>
            <Space direction="vertical" size="large">
                <Space align="center" size="middle">
                    <div className={`${style["atn-footer-content"]}`}>
                        <div
                            className={`${style["atn-footer-link-container"]} ${style["atn-footer-text"]}`}
                        >
                            <Button
                                type="link"
                                className={`${style["link-text"]}`}
                                key="teamInformation"
                                href="https://discord.com/invite/VzDBscSK"
                                target={"_blank"}
                            >
                                {t("common:footer.teamInformation")}
                            </Button>

                            <Button
                                type="link"
                                className={`${style["link-text"]}`}
                                key="privacyPolicy"
                                href="https://discord.com/invite/VzDBscSK"
                                target={"_blank"}
                            >
                                {t("common:footer.privacyPolicy")}
                            </Button>

                            <Button
                                type="link"
                                className={`${style["link-text"]}`}
                                key="support"
                                href="https://discord.com/invite/VzDBscSK"
                                target={"_blank"}
                            >
                                {t("common:footer.support")}
                            </Button>

                            <Button
                                type="link"
                                className={`${style["link-text"]}`}
                                key="termsAndConditions"
                                href="https://discord.com/invite/VzDBscSK"
                                target={"_blank"}
                            >
                                {t("common:footer.termsAndConditions")}
                            </Button>

                        </div>
                        <span className={`${style["atn-footer-text"]}`}>
              {t("common:footer.fullCopyright")}
            </span>
                    </div>
                </Space>
            </Space>
        </div>
    );
};
