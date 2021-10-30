import style from "./account.module.scss";
import {useTranslation} from "next-i18next";
import {Input} from "antd";
import { faPen, faTimes, faSave, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useEffect, useState} from "react";
import AuthService, {GetUserInfo} from "../../api/auth/index"

export const AccountTemplate = () => {

    const { t } = useTranslation();

    const [editable, setEditable] = useState(false);

    const [profile, setProfile] = useState({
        emailAddress: "",
        username: "",
        fullName: "",
        phoneNumber: "",
        age: "",
    })

    useEffect(() => {
        AuthService.getProfile( {userInfo : GetUserInfo()}).then(
            (data) => {
                setProfile({
                    ...profile,
                    emailAddress: data.email,
                    username: data.username,
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    age: data.age,
                })
            }
        )
    }, [])

    const handleCancelOnClick = () => {
        AuthService.getProfile( {userInfo : GetUserInfo()}).then(
            (data) => {
                if (!data.error) {
                    setProfile({
                        ...profile,
                        emailAddress: data.email,
                        username: data.username,
                        fullName: data.fullName,
                        phoneNumber: data.phoneNumber,
                        age: data.age,
                    });
                    setEditable(false);
                }
            }
        )
    }

    const handleSaveOnClick = () => {
        AuthService.saveProfile({ userInfo : GetUserInfo(), profile : {
                fullName: profile.fullName,
                age: profile.age,
                phoneNumber: profile.phoneNumber,
            }}).then((data) => {
                if (!data.error) {
                    setEditable(false);
                }
        })
    }

    const onFullNameChange = (e) => {
        setProfile({
            ...profile,
            fullName: e.target.value,
        })
    }
    const onPhoneNumberChange = (e) => {
        setProfile({
            ...profile,
            phoneNumber: e.target.value,
        })
    }
    const onAgeChange = (e) => {
        setProfile({
            ...profile,
            age: e.target.value,
        })
    }

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
                                value={profile.emailAddress}
                                disabled={true}
                            />
                        </div>

                        <div className={`${style["field-part"]}`}>
                            <div>
                                {t("account:accountPage.username")}
                            </div>
                            <Input
                                className={`${style["input"]}`}
                                value={profile.username}
                                disabled={true}
                            />
                        </div>

                        <div className={`${style["field-part"]}`}>
                            <div>
                                {t("account:accountPage.fullName")}
                            </div>
                            <Input
                                className={`${style["input"]}`}
                                value={profile.fullName}
                                disabled={!editable}
                                onChange={onFullNameChange}
                            />
                        </div>

                        <div className={`${style["field-part"]}`}>
                            <div>
                                {t("account:accountPage.phoneNumber")}
                            </div>
                            <Input
                                className={`${style["input"]}`}
                                value={profile.phoneNumber}
                                disabled={!editable}
                                onChange={onPhoneNumberChange}
                            />
                        </div>

                        <div className={`${style["field-part"]}`}>
                            <div>
                                {t("account:accountPage.age")}
                            </div>
                            <Input
                                className={`${style["input"]}`}
                                value={profile.age}
                                disabled={!editable}
                                onChange={onAgeChange}
                            />
                        </div>

                        <div className={`${style["button-container"]}`}>
                            {editable && (
                                <div className={`${style["cancel-button"]}`}
                                     onClick={handleCancelOnClick}
                                >
                                    <FontAwesomeIcon icon={faTimes}
                                                     className={`
                                                     ${style["icon-button"]} 
                                                     ${style["blue"]}`
                                                     }
                                    />
                                    <div className={`${style["text-button"]}`}>
                                        {t("account:accountPage.cancel")}
                                    </div>
                                </div>
                            )}
                            {!editable && (
                                <div className={`${style["active-white"]}`}
                                     onClick={() => {setEditable(true)}}
                                >
                                    <FontAwesomeIcon icon={faPen} className={`${style["edit-pen"]}`}/>
                                    {t("account:accountPage.edit")}
                                </div>
                            )}
                            {editable && (
                                <div className={`${style["active-button"]}`}
                                     onClick={handleSaveOnClick}
                                >
                                    <FontAwesomeIcon icon={faSave}
                                                     className={`
                                                     ${style["icon-button"]} 
                                                     ${style["white"]}`
                                                     }
                                    />
                                    <div className={`${style["text-button"]}`}>
                                        {t("account:accountPage.save")}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <div className={`${style["section"]}`}>
                    <div className={`${style["big-bold"]}`}>
                        {t("account:accountPage.myPaymentMethod")}
                    </div>
                    <div className={`${style["info-display"]}`}>
                        <div className={`${style["active-button"]}`}>
                            <FontAwesomeIcon icon={faPlus}
                                             className={`
                                                     ${style["icon-button"]} 
                                                     ${style["white"]}`
                                             }
                            />
                            <div className={`${style["text-button"]}`}>
                                {t("account:accountPage.addNewCard")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
