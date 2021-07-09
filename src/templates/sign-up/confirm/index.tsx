import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import MailServiceApi from '../../../api/mail-service/sent-mail';
import { useRouter } from "next/router";
import { notifyError } from "@components/toastify";

const SignUpConfirmTemplate = () => {
    const { t } = useTranslation();
    const route = useRouter();
    const { email } = route.query;
    const [countTime, setCountTime] = useState(0);
    const [success, setSuccess] = useState(false);
    const [loop, setLoop] = useState(1000);

    useEffect(() => {
        if (countTime > 0) {
            setTimeout(() => {
                setCountTime(countTime - 1);
            }, 1000);
        }
    }, [countTime]);

    useEffect(() => {
        !success && MailServiceApi.getUserStatus({
            username: email
        }).then(data => {
            console.log(data)
            data.isActive && setSuccess(true)
        }).catch(err => {
            notifyError(err)
        })
    }, [countTime])

    const resentMail = (mail) => {
        setCountTime(60)
        MailServiceApi.getUserStatus({
            username: email
        }).then(data => {
            !data.isActive && MailServiceApi.verifyMail({
                username: mail,
                type: 'verify-email'
            }).then(data => {
                console.log(data)
            }).catch(notifyError);
        }).catch(err => {
            notifyError(err)
        })
    }

    const resendMail = () => {
        return (
            <div>
                <div className="resend-alert">
                    {t("sign-up:didNotReceive")}{" "}
                    <a className="resend-link"
                       onClick={() => resentMail(email)}
                    >
                        {t("sign-up:resend")}
                    </a>
                </div>
                <div className="create-account-btn resend-btn disable-select"
                     onClick={() => resentMail(email)}
                >
                    {t("sign-up:resend")}
                </div>
            </div>
        )
    }

    const countDown = () => {
        return (
            <div className="text-count-time">
                {t('common:resendLinkMsg')} {' '}
                <div className="count-time">
                    {countTime}
                </div>{' '}
                {t('common:seconds')}
            </div>
        )
    }

    useEffect(() => {
        if (loop > 0) {
            setTimeout(() => {
                setLoop(loop - 1);
            }, 1000);
        } else {
            setLoop(1000)
        }
        localStorage?.getItem('checkStatus') === 'true' &&
        MailServiceApi.getUserStatus({
            username: email
        }).then(data => {
            console.log(data)
            data.isActive && setSuccess(true)
            localStorage.removeItem('checkStatus')
        })
    }, [loop])

    return (
        success ?
            (<React.Fragment>
                <div className="sign-up-success-container">
                    <div
                        style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginBottom: "38px",
                            width: "56px",
                        }}
                    >
                        <img src="/icons/success.png" height="56px" width="56px" />
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
            </React.Fragment>) : (
                <React.Fragment>
                    <div className="sign-up-container-confirm">
                        <div className="sign-up-header">{t("sign-up:arium")}</div>
                        <div className="sign-up-header sub-header-confirm">
                            {t("sign-up:createAccount2")}
                        </div>
                        <div className="sign-up-notification">
                            {t("sign-up:confirmlink")}{" "}
                            <span className="sign-up-email">{email}</span>
                            {t("sign-up:checkMail")}
                        </div>
                        {
                            countTime === 0 ? resendMail() : countDown()
                        }
                    </div>
                </React.Fragment >)
    );
};

export default SignUpConfirmTemplate;