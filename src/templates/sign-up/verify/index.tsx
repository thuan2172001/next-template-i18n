import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MailServiceApi from '../../../api/mail-service/sent-mail';
import { notifyError } from "@components/toastify";

const VerifySignUpTemplate = () => {
    const { t } = useTranslation();
    const route = useRouter();
    const { activeCode, id } = route.query;
    const [isSuccess, setSuccessStatus] = useState(false)

    useEffect(() => {
        activeCode && id && MailServiceApi.verifyCode({
            activeCode: activeCode,
            userId: id,
        }).then(data => {
            window && localStorage.setItem('checkStatus', 'true')
            setSuccessStatus(true)
        }).catch(err => {
            notifyError(err)
            route.push('/page-not-found')
            setSuccessStatus(false)
        })
    }, [activeCode, id])

    return isSuccess ? (
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
                    onClick={() => route.push("/login")}
                >
                    {t("sign-up:logIn")}
                </div>
            </div>
        </React.Fragment>
    ) : <></>;
};

export default VerifySignUpTemplate;