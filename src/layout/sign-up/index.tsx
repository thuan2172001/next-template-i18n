import React, { useState, useEffect } from 'react'
import { Button, Input, Checkbox, notification, Popover } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from 'next-i18next'
import style from './sign-up.module.scss'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import AuthServiceAPI from '../../api/auth'
import VerifySignUpTemplate from './verify'
import Head from "next/head";

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
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\()_+=\-/*+{}|\[\]'"<,>.?/~`\\])(?=.{8,})/,
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
            <Head>
                <title>WebtoonZ | {t('common:header.signUp')}</title>
            </Head>
            <div className={style["signup-container"]}>
                <div className={style['signup-title']}>{t("common:createAcc.title")}</div>
                <form onSubmit={formik.handleSubmit} className={style['signup-form']}>
                    <h4>{t("account:accountPage.username")}</h4>
                    <Popover
                        placement={"right"}
                        content={formik.errors.user_name}
                        visible={formik.errors.user_name !== undefined ? formik.touched.user_name : false}
                        trigger={"focus"}
                    >
                        <Input
                            className={`${style['ant-input-custom']} ${style['ant-input-signup-form']}`}
                            placeholder={t("account:accountPage.username")}
                            name="user_name"
                            autoComplete="off"
                            value={formik.values.user_name}
                            onChange={formik.handleChange}
                        />
                    </Popover>

                    {!availableUsername && <p className={`${style["signup-notify"]}`}>{t("common:errorMsg.usernameExisted")}</p>}

                    <h4>{t("account:accountPage.emailAddress")}</h4>
                    <Popover
                        placement={"right"}
                        content={formik.errors.email}
                        visible={formik.errors.email !== undefined ? formik.touched.email : false}
                        trigger={"focus"}
                    >
                        <Input
                            className={`${style["ant-input-custom"]} ${style['ant-input-signup-form']}`}
                            placeholder={t("account:accountPage.emailAddress")}
                            name="email"
                            autoComplete="off"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                    </Popover>

                    {!availableEmail && <p className={`${style["signup-notify"]}`}>{t("common:errorMsg.emailExisted")}</p>}

                    <h4>{t("account:accountPage.fullName")}</h4>
                    <Popover
                        placement={"right"}
                        content={formik.errors.full_name}
                        visible={formik.errors.full_name !== undefined ? formik.touched.full_name : false}
                        trigger={"focus"}
                    >
                        <Input
                            className={`${style["ant-input-custom"]} ${style['ant-input-signup-form']}`}
                            placeholder={t("account:accountPage.fullName")}
                            name="full_name"
                            autoComplete="off"
                            value={formik.values.full_name}
                            onChange={formik.handleChange}
                        />
                    </Popover>

                    <h4>{t("account:accountPage.password")}</h4>
                    <Popover
                        style={{ width: 400 }}
                        placement={"right"}
                        content={formik.errors.password}
                        visible={formik.errors.password !== undefined ? formik.touched.password : false}
                        trigger={"focus"}
                    >
                        <Input.Password
                            className={`${style['ant-input-custom']} ${style['ant-input-signup-form']}`}
                            placeholder="Your password"
                            name="password"
                            autoComplete="off"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                    </Popover>

                    <h4>{t("common:createAcc.confirmPw")}</h4>
                    <Popover
                        placement={"right"}
                        content={formik.errors.confirm_password}
                        visible={formik.errors.confirm_password !== undefined ? formik.touched.confirm_password : false}
                        trigger={"focus"}
                    >
                        <Input.Password
                            className={`${style['ant-input-custom']} ${style['ant-input-signup-form']}`}
                            placeholder="Confirm your password"
                            name="confirm_password"
                            autoComplete="off"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            value={formik.values.confirm_password}
                            onChange={formik.handleChange}
                        />
                    </Popover>

                    <Popover
                        placement={"bottom"}
                        content={formik.errors.checkbox}
                        visible={formik.errors.checkbox !== undefined ? formik.touched.checkbox : false}
                        trigger={"hover"}
                    >
                        <Checkbox
                            name="checkbox"
                            onChange={formik.handleChange}
                        >
                            {t("common:createAcc.privacy1")}&nbsp;
                            <a href="">{t("common:createAcc.privacy2")}</a>&nbsp;
                            {t("common:createAcc.privacy3")}&nbsp;
                            <a href="">{t("common:createAcc.privacy4")}</a>
                        </Checkbox>
                    </Popover>

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
