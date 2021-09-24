import style from "./account.module.scss";
import {useTranslation} from "next-i18next";
import {Input} from "antd";

export const AccountTemplate = () => {

    const { t } = useTranslation();

    return (
        <div className={`${style["container"]}`}>
            <div className={`${style["big-bold"]}`}>
                {t("account:accountPage.account")}
            </div>
            <div className={`${style["sub-container"]}`}>
                <div className={`${style["section"]}`}>
                    <div className={`${style["big-bold"]}`}>
                        {t("account:accountPage.accountInfo")}
                    </div>
                    <div className={`${style["info-display"]}`}>
                        <div className={`${style["field-part"]}`}>
                            <div>
                                {t("account:accountPage.emailAddress")}
                            </div>
                            <Input
                                className={`${style["input"]}`}
                                value={"thuanhbui@gmail.com"}
                                disabled={true}
                            />
                        </div>
                        <div className={`${style["field-part"]}`}>
                            <div>
                                {t("account:accountPage.fullName")}
                            </div>
                            <Input
                                className={`${style["input"]}`}
                                value={"Bui Anh Thu"}
                            />
                            <span className={`${style["edit-button"]}`}>
                                {t("account:accountPage.edit")}
                            </span>
                        </div>
                        <div className={`${style["field-part"]}`}>
                            <div>
                                {t("account:accountPage.username")}
                            </div>
                            <Input
                                className={`${style["input"]}`}
                                value={"thuanhbui"}
                                disabled={true}
                            />
                        </div>
                        <div className={`${style["field-part"]}`}>
                            <div>
                                {t("account:accountPage.password")}
                            </div>
                            <Input
                                className={`${style["input"]}`}
                                value={"hihihihi"}
                                type={"password"}
                            />
                            <span className={`${style["edit-button"]}`}>
                                {t("account:accountPage.edit")}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`${style["section"]}`}>
                    <div className={`${style["big-bold"]}`}>
                        {t("account:accountPage.myPaymentMethod")}
                    </div>
                    <div className={`${style["info-display"]}`}>
                        Huhuhu
                    </div>
                </div>

            </div>
        </div>
    )
}
