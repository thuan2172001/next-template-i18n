import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {Button} from "antd"
import style from "./verify.module.scss"

const VerifySignUpTemplate = () => {
    const { t } = useTranslation();
    const route = useRouter()
    return (
        <div className={style["sign-up-success-container"]}>
            <div className={style["message-container"]}>
                <img className={style["success-icon"]}
                     src="/assets/icons/success.png"/>
                <div className={style["verify-title"]}>Thank you!</div>
                <div className={style["verify-message"]}>Your account is verified!</div>

                <div className={style['btn-controller']}>
                    <Button
                        htmlType="submit"
                        className={`${style['verify-button']}`}
                        onClick={() => route.push("/login")}
                    >
                        Login
                    </Button>
                </div>
            </div>

        </div>
    )
};

export default VerifySignUpTemplate;