import React, { useState, useEffect } from 'react'
import {Button, Input, Checkbox, notification} from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from 'next-i18next'
import style from './sign-up.module.scss'
import { useFormik } from 'formik'
import * as Yup from "yup"
import AuthServiceAPI from '../../api/auth'

const SignupTemplate = (props) => {
    const { t } = useTranslation();
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
                .min(6, "Minimum 6 characters")
                .max(10, "Maximum 15 characters")
                .required("Required!"),
            email: Yup.string()
                .email("Invalid email format")
                .required("Required!"),
            full_name: Yup.string()
                .required("Required!"),
            password: Yup.string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\()_+=\-/*+{}|\[\]'"<,>.?/~`\\])(?=.{8,})/,
                    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                )
                .required("Required!"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password")], "Password's not match")
                .required("Required!"),
            checkbox: Yup.boolean().oneOf([true], "You need to confirm Terms of Uses and Privacy Policy")
        }),
        onSubmit: values => {
            const {user_name, email, full_name, password, confirm_password, checkbox} = values;
            AuthServiceAPI.signup({user_name, email, full_name, password}).then(response => {
                console.log(response)
            })
        }
    })

    return (
        <div className={style["container"]}>
            <div className={style["signup-container"]}>
                <div className={style['signup-title']}>Create new account</div>
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
                        placeholder={t("account:accountPage.password")}
                        name="password"
                        autoComplete="off"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />

                    {formik.errors.password && formik.touched.password && (
                        <p className={`${style["signup-notify"]}`}>{formik.errors.password}</p>
                    )}

                    <h4>Confirm your password</h4>
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
                        I have read and agree to the <a href="">Terms of Uses</a> and <a href="">Privacy Policy</a>
                    </Checkbox>

                    {formik.errors.checkbox && formik.touched.confirm_password && (
                        <p className={`${style["signup-notify"]}`}>{formik.errors.checkbox}</p>
                    )}

                    <div className={style['btn-controller']}>
                        <Button
                            htmlType="submit"
                            className={`${style['ant-btn-signup']}`}
                        >
                            Sign up
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupTemplate;
