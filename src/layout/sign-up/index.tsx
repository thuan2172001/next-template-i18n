import React, { useState, useEffect } from 'react'
import { Button, Input, Checkbox, notification } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from 'next-i18next'
import style from './sign-up.module.scss'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import AuthServiceAPI from '../../api/auth'
import VerifySignUpTemplate from './verify'

const SignupTemplate = (props) => {
    const { t } = useTranslation();
    const [signupStatus, setSignupStatus] = useState(false);
    const [availableUsername, setAvailableUsername] = useState(true);
    const [availableEmail, setAvailableEmail] = useState(true);
    const [loading, setLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            user_name: "",
            email: "",
            full_name: "",
            password: "",
            confirm_password: "",
            checkbox: false,
        },
        validationSchema: Yup.object({
            user_name: Yup.string()
                .min(6, t("common:errorMsg.min6"))
                .max(15, t("common:errorMsg.max15"))
                .required(t("common:errorMsg.usernameRequired")),
            email: Yup.string()
                .email(t("common:errorMsg.invalidEmail"))
                .required(t("common:errorMsg.emailRequired")),
            full_name: Yup.string()
                .required(t("common:errorMsg.fullNameRequired")),
            password: Yup.string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]){8,})/,
                    t("common:errorMsg.passwordRuleNotPassed")
                )
                .required(t("common:errorMsg.passwordRequired")),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password")], t("common:errorMsg.passwordNotMatch"))
                .required(t("common:errorMsg.confirmPwRequired")),
            checkbox: Yup.boolean().oneOf([true], t("common:errorMsg.confirmTerms"))
        }),
        onSubmit: values => {
            const { user_name, email, full_name, password, confirm_password, checkbox } = values;
            setLoading(true);
            AuthServiceAPI.signup({ user_name, email, full_name, password }).then(response => {
                if (!response.reason) {
                    setSignupStatus(true);
                    setLoading(false);
                }
            }).catch(err => {
                console.log(err)
                setLoading(false);
                if (err == "USER.CREATE_USER.EXISTED_USERNAME") {
                    setAvailableUsername(false);
                } else {
                    setAvailableUsername(true);
                }
                if (err == "USER.CREATE_USER.EXISTED_EMAIL") {
                    setAvailableEmail(false);
                } else {
                    setAvailableEmail(true);
                }
            });
        }
    })

    if (signupStatus) {
        return <VerifySignUpTemplate />
    }
    return (
        <div className={style["container"]}>
            <div className={style["signup-container"]}>
                <div className={style['signup-title']}>{t("common:createAcc.title")}</div>
                <form onSubmit={formik.handleSubmit} className={style['signup-form']}>
                    <h4>{t("account:accountPage.username")}</h4>
                    <Input
                        className={`${style['ant-input-custom']} ${style['ant-input-signup-form']}`}
                        placeholder={t("account:accountPage.username")}
                        name="user_name"
                        autoComplete="off"
                        value={formik.values.user_name}
                        onChange={formik.handleChange}
                    />

                    {!availableUsername && <p className={`${style["signup-notify"]}`}>{t("common:errorMsg.usernameExisted")}</p>}

                    {formik.errors.user_name && formik.touched.user_name && (
                        <p className={`${style["signup-notify"]}`}>{formik.errors.user_name}</p>
                    )}

                    <h4>{t("account:accountPage.emailAddress")}</h4>
                    <Input
                        className={`${style["ant-input-custom"]} ${style['ant-input-signup-form']}`}
                        placeholder={t("account:accountPage.emailAddress")}
                        name="email"
                        autoComplete="off"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />

                    {!availableEmail && <p className={`${style["signup-notify"]}`}>{t("common:errorMsg.emailExisted")}</p>}

                    {formik.errors.email && formik.touched.email && (
                        <p className={`${style["signup-notify"]}`}>{formik.errors.email}</p>
                    )}

                    <h4>{t("account:accountPage.fullName")}</h4>
                    <Input
                        className={`${style["ant-input-custom"]} ${style['ant-input-signup-form']}`}
                        placeholder={t("account:accountPage.fullName")}
                        name="full_name"
                        autoComplete="off"
                        value={formik.values.full_name}
                        onChange={formik.handleChange}
                    />

                    {formik.errors.full_name && formik.touched.full_name && (
                        <p className={`${style["signup-notify"]}`}>{formik.errors.full_name}</p>
                    )}

                    <h4>{t("account:accountPage.password")}</h4>
                    <Input.Password
                        className={`${style['ant-input-custom']} ${style['ant-input-signup-form']}`}
                        placeholder="Your password"
                        name="password"
                        autoComplete="off"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />

                    {formik.errors.password && formik.touched.password && (
                        <p className={`${style["signup-notify"]}`}>{formik.errors.password}</p>
                    )}

                    <h4>{t("common:createAcc.confirmPw")}</h4>
                    <Input.Password
                        className={`${style['ant-input-custom']} ${style['ant-input-signup-form']}`}
                        placeholder="Confirm your password"
                        name="confirm_password"
                        autoComplete="off"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        value={formik.values.confirm_password}
                        onChange={formik.handleChange}
                    />

                    {formik.errors.confirm_password && formik.touched.confirm_password && (
                        <p className={`${style["signup-notify"]}`}>{formik.errors.confirm_password}</p>
                    )}

                    <Checkbox
                        name="checkbox"
                        onChange={formik.handleChange}
                    >
                        {t("common:createAcc.privacy1")} 
                        <a href="">{t("common:createAcc.privacy2")}</a> 
                        {t("common:createAcc.privacy3")} 
                        <a href="">{t("common:createAcc.privacy4")}</a>
                    </Checkbox>

                    {formik.errors.checkbox && formik.touched.confirm_password && (
                        <p className={`${style["signup-notify"]}`}>{formik.errors.checkbox}</p>
                    )}

                    <div className={style['btn-controller']}>
                        <Button
                            loading={loading}
                            htmlType="submit"
                            className={`${style['ant-btn-signup']}`}
                        >
                            {t("common:createAcc.signup")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupTemplate;
