import Image from "next/image";
import React from "react";
import { useTranslation } from "next-i18next";
import Router from "next/router";

const SuccessSignUpTemplate = () => {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            <div className="sign-up-success-container">
                <div
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginBottom: "38px",
                        width: "56px",
                    }}
                >
                    <Image src="/icons/success.png" height={56} width={56} />
                </div>
                <div
                    className="success-message"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                >
                    <div>{t("sign-up:thankYou")},</div>
                    {t("sign-up:yourAccountVerified")}
                </div>
                <div
                    className="footer-button save-active"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                    onClick={() => Router.push("/login")}
                >
                    {t("sign-up:logIn")}
                </div>
            </div>
        </React.Fragment>
    );
};

export default SuccessSignUpTemplate;
