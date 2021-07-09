import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Form, Input, Checkbox, Button } from "antd";
import { useRouter } from "next/router";
import { RuleObject } from "rc-field-form/lib/interface";
import UserAPI from "../../api/user/index";
import MailServiceApi from "../../api/mail-service/sent-mail";
import { notifyError } from "@components/toastify";

const SignUpTemplate = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const [passConvention, setPassConvention] = useState({
        pc1: false,
        pc2: false,
        pc3: false,
        pc4: false,
        pc5: false,
    })

    const [userNameValid, setUserNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
    const [typeErrMsg, setShow] = useState("");
    const [clickSubmit, setClickSubmit] = useState(false);

    const [isUserExisted, setIsUserExisted] = useState(false);
    const [isEmailExisted, setIsEmailExisted] = useState(false);

    const handelUserOnChange = (value) => {
        setIsUserExisted(false);
        setUserName(value);
        setUserNameValid(validateUsername(value));
    };

    const handelEmailOnChange = (value) => {
        validateEmail(value);
        setEmail(value);
        setIsEmailExisted(false);
    };

    const handelPasswordOnChange = (e) => {
        const { value } = e.target;
        validatePassword(value);
        validateCfPassword(confirmPassword, value);
        setPassword(value);
    };

    const handelConfirmPasswordOnChange = (e) => {
        const { value } = e.target;
        validateCfPassword(value, password);
        setConfirmPassword(value);
    };

    const handleRemember = (e) => {
        setRemember(e.target.checked);
    };

    const validateUsername = (value) => {
        if (value !== "") {
            return value.length < 20;
        }
    };

    const validateEmail = (value) => {
        if (value !== "") {
            const emailRule = new RegExp(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
            if (emailRule.test(value)) {
                setEmailValid(true);
            } else setEmailValid(false);
        }
    };

    const validatePassword = (value) => {
        setPassConvention({...passConvention,
            'pc1': value.length >= 8,
            'pc2': RegExp(".*[A-Z].*").test(value),
            'pc3': RegExp(".*[a-z].*").test(value),
            'pc4': RegExp(".*\\d.*").test(value),
            'pc5': !RegExp(".*\\s.*").test(value)
        });
    };

    const validateCfPassword = (value1, value2) => {
        if (value1 !== value2) setConfirmPasswordValid(false);
        else setConfirmPasswordValid(true);
    };

    const removeExtraSpace = (str) => {
        return str.replace(/ +(?= )/g, "");
    };

    const UserErrorMsg = () => {
        return (
            <div
                className={`username-msg  err-msg message-${
                    userNameValid ? "valid" : "invalid"
                }`}
            >
                {t("sign-up:userNameConvention")}
            </div>
        );
    };

    const UserExistedErr = () => {
        return <div className="edit-notify">{t("sign-up:userExisted")}</div>;
    };

    const EmailExistedErr = () => {
        return <div className="edit-notify">{t("sign-up:emailExisted")}</div>;
    };

    const EmailErrorMsg = () => {
        return (
            <div className={`email-msg err-msg message message-invalid`}>
                {t("sign-up:emailConvention")}
            </div>
        );
    };

    const PasswordErrorMsg = () => {
        const ulItem = Object.keys(passConvention).map((key, index) =>
            <li
                className={`message-${passConvention[key] ? "valid" : "invalid"}`}
            >
                {t(`sign-up:passwordConvention${index +1 }`)}
            </li>)

        return (
            <div className="password-msg err-msg">
                {t("sign-up:passwordConventionTitle")}
                <ul>
                    {ulItem}
                </ul>
            </div>
        );
    };

    const CfPasswordErrorMsg = () => {
        return (
            <div className={`cfpassword-msg err-msg message-invalid`}>
                {t("sign-up:cfPasswordConvention")}
            </div>
        );
    };

    const handleSubmit = () => {
        setClickSubmit(true);
        setUserName(removeExtraSpace(userName));

        UserAPI.register({
            displayName: userName,
            username: email,
            password,
        })
            .then(() => {
                MailServiceApi.verifyMail({
                    username: email,
                    type: "verify-email",
                }).catch(notifyError);
                router.push(`/signup/confirm?email=${email}`);
            })
            .catch((err) => {
                err === "USER.POST.USERNAME_HAS_EXISTED" && setIsUserExisted(true);
                err === "USER.POST.EMAIL_HAS_EXISTED" && setIsEmailExisted(true);
            });
    };

    const validation = (
        rule: RuleObject,
        value: any,
        callback: (error?: string) => void
    ) => {
        if (remember) {
            return callback();
        }
        return callback(t("sign-up:rememberErrMsg"));
    };

    return (
        <React.Fragment>
            <div className="sign-up-container">
                <div className="sign-up-header">{t("sign-up:arium")}</div>
                <div className="sign-up-header sub-header">
                    {t("sign-up:createAccount1")}
                </div>
                <Form layout="vertical">
                    <Form.Item label={t("sign-up:userName")}>
                        <input
                            className="ant-input sign-up-username"
                            value={userName}
                            placeholder={t("sign-up:userName")}
                            type="text"
                            onChange={(e) => {
                                e.target.value = e.target.value.replace(/\s+/g, " ");
                                handelUserOnChange(e.target.value);
                            }}
                            onBlur={() => setShow("")}
                            onFocus={() => setShow("username")}
                        />
                    </Form.Item>

                    {isUserExisted && <UserExistedErr />}

                    <Form.Item
                        name="email"
                        label={t("sign-up:email")}
                        rules={[
                            {
                                required: true,
                                message: t("sign-up:emailErrMsg"),
                            },
                        ]}
                    >
                        <Input
                            placeholder={t("sign-up:yourEmail")}
                            onChange={(e) => handelEmailOnChange(e.target.value)}
                            value={email}
                            name="email"
                            onFocus={() => setShow("email")}
                            onBlur={() => {
                                setShow("email");
                            }}
                        />
                    </Form.Item>

                    {isEmailExisted && <EmailExistedErr />}

                    <Form.Item
                        name="password"
                        label={t("sign-up:createPass")}
                        rules={[
                            {
                                required: true,
                                message: t("sign-up:passwordErrMsg"),
                            },
                        ]}
                    >
                        <Input
                            placeholder={t("sign-up:yourPassword")}
                            type="password"
                            onChange={handelPasswordOnChange}
                            value={password}
                            name="password"
                            onBlur={() => setShow("")}
                            onFocus={() => setShow("password")}
                            className={`${(!passConvention) &&
                            clickSubmit
                                ? "input-invalid"
                                : ""
                            }`}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label={t("sign-up:confirmNewPassWord")}
                        rules={[
                            {
                                required: true,
                                message: t("sign-up:cfpassErrMsg"),
                            },
                        ]}
                    >
                        <Input
                            placeholder={t("sign-up:yourPassword")}
                            type="password"
                            onChange={handelConfirmPasswordOnChange}
                            value={confirmPassword}
                            name="confirmPassword"
                            onFocus={() => setShow("cfpassword")}
                            onBlur={() => {
                                setShow("cfpassword");
                            }}
                            className={`${
                                !confirmPasswordValid && clickSubmit ? "input-invalid" : ""
                            }`}
                        />
                    </Form.Item>
                    <Form.Item name="remember" rules={[{ validator: validation }]}>
                        <Checkbox name="remember" onChange={handleRemember}>
              <span className="text-color-light-black">
                {t("sign-up:agree")}{" "}
                  <span className="text-color-light-orange">
                  {t("sign-up:termOfUse")}
                </span>{" "}
                  {t("sign-up:and")}{" "}
                  <span className="text-color-light-orange">
                  {t("sign-up:privacy")}
                </span>{" "}
              </span>
                        </Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            htmlType="submit"
                            className="create-account-btn disable-select"
                            disabled={
                                !userNameValid ||
                                !emailValid ||
                                !passConvention ||
                                !confirmPasswordValid ||
                                !remember
                            }
                            onClick={() => {
                                handleSubmit();
                            }}
                        >
                            {t("sign-up:createAccount")}
                        </Button>
                    </Form.Item>
                </Form>

                {typeErrMsg === "username" && <UserErrorMsg />}
                {typeErrMsg === "password" && <PasswordErrorMsg />}
                {typeErrMsg === "email" && !emailValid && <EmailErrorMsg />}
                {typeErrMsg === "cfpassword" && !confirmPasswordValid && (
                    <CfPasswordErrorMsg />
                )}
            </div>
        </React.Fragment>
    );
};

export default SignUpTemplate;
