import React, { useState, useEffect } from 'react'
import {Button, Input, Checkbox} from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from 'next-i18next'
import style from './sign-up.module.scss'
import serie from "../../api/customer/serie";

const SignupTemplate = (props) => {

    const { t } = useTranslation()
    const [userName, setUserName] = useState("")
    const [isUserNameType, setIsUserNameType] = useState(false)
    const [isUserNameExist, setIsUserNameExist] = useState(false)

    const [email, setEmail] = useState("")
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [isEmailExist, setIsEmailExist] = useState(false)

    const [fullName, setFullName] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [isNewPasswordTyped, setIsNewPasswordTyped] = useState(false)
    const [isPasswordValid,setIsPasswordValid] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isConfirmPasswordTyped, setIsConfirmPasswordTyped] = useState(false)

    const [checkboxState, setCheckboxState] = useState(false)

    const handleSignup = () => {

    }

    const handleChangeUserName = (value) => {
        setUserName(value)

    }

    const handleChangeEmail = (value) => {
        setEmail(value)
        emailValidation(value)
    }

    const emailValidation = (value) => {
        setIsEmailValid(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        )
    }

    const handleChangeNewPassword = (value) => {
        setNewPassword(value)
        setIsNewPasswordTyped(true)
        validatePassword(value)
    }

    const validatePassword = (value) => {
        value.length < 8 ||
        !RegExp(".*[A-Z].*").test(value) ||
        !RegExp(".*[a-z].*").test(value) ||
        !RegExp(".*\\d.*").test(value) ||
        value != value.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ||
        /\s/.test(value)
            ? setIsPasswordValid(false)
            : setIsPasswordValid(true);
    }

    const handleChangeConfirmPassword = (value) => {
        setIsConfirmPasswordTyped(true);
        setConfirmPassword(value);
    };

    return (
        <div className={style["container"]}>
            <div className={style["signup-container"]}>
                <div className={style['signup-title']}>Create new account</div>
                <div className={style['signup-form']}>
                    <h4>User Name</h4>
                    <Input
                        className={`${style['ant-input-custom']} ${style['ant-input-signup-form']}`}
                        placeholder={"User Name"}
                        autoComplete="off"
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                    />

                    <h4>Email address</h4>
                    <Input
                        className={`${style["ant-input-custom"]} ${style['ant-input-signup-form']}`}
                        placeholder="Your email address"
                        autoComplete="off"
                        onChange={(e) => {
                            handleChangeEmail(e.target.value);
                        }}
                    />

                    <h4>Full name</h4>
                    <Input
                        className={`${style["ant-input-custom"]} ${style['ant-input-signup-form']}`}
                        placeholder="Your full name"
                        autoComplete="off"
                        onChange={(e) => {
                            setFullName(e.target.value)
                        }}
                    />

                    <h4>Password</h4>
                    <Input.Password
                        className={`${style['ant-input-custom']} ${style['ant-input-signup-form']}`}
                        placeholder="Your password"
                        autoComplete="off"
                        type="password"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        onChange={(e) => {
                            handleChangeNewPassword(e.target.value)
                        }}
                    />

                    {isNewPasswordTyped &&
                        (newPassword == "" ? (
                                <div className={`${style["signup-notify"]}`}>
                                    Please input your password
                                </div>
                            ) : isPasswordValid ? (
                                <></>
                            ) : (
                                <div className={`${style["signup-notify"]}`}>
                                    {t("account:newPasswordSyntax")}
                                </div>
                            )
                        )
                    }

                    <h4>Confirm your password</h4>
                    <Input.Password
                        className={`${style['ant-input-custom']} ${style['ant-input-signup-form']}`}
                        placeholder="Confirm your password"
                        autoComplete="off"
                        type="password"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        onChange={(e) => {
                            handleChangeConfirmPassword(e.target.value)
                        }}
                    />

                    {isConfirmPasswordTyped &&
                        (confirmPassword != "" ? (
                            confirmPassword == newPassword ? (
                                <></>
                            ) : (
                                <div className={`${style["signup-notify"]} ${style["text-color-red"]}`}>
                                    {t("account:confirmPasswordNotMatch")}
                                </div>
                            )
                            ) : (
                                <div className={`${style["signup-notify"]} ${style["text-color-red"]}`}>
                                    Please confirm your password
                                </div>
                            )
                        )
                    }

                    <Checkbox
                        defaultChecked={false}
                        onChange={(e) => {
                            setCheckboxState(!checkboxState)
                        }}
                    >
                        I have read and agree to the <a href="">Terms of Uses</a> and <a href="">Privacy Policy</a>
                    </Checkbox>
                </div>

                <div className={style['btn-controller']}>
                    <Button
                        className={`${style['ant-btn-signup']}`}
                        onClick={handleSignup}
                    >
                        {t('common:header.signUp')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SignupTemplate;
