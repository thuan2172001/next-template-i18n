import React, {useEffect, useState} from 'react';
import {Button, Space} from 'antd';
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
import style from './header-searchbar.module.scss';
import {root} from "postcss";
import CustomerBookshelfAPI from "../../api/customer/bookshelf";
import {GetUserInfo} from "src/api/auth";

export const SearchBar2 = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState("");
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    if (router.isReady) {
      let last = router.pathname.lastIndexOf('/')
      setPage(router.pathname.substring(last + 1, router.pathname.length))
      console.log(router)
    }
  }, [router])

  const handleSearch = () => {
    switch (page) {
      case "": case "account":
        router.push(`/?pattern=${searchInput}` )
        break;
      case "liked":
        router.push(`/user/liked?category=all&liked=serie&pattern=${searchInput}` )
        break;
      case "bookshelf":
        router.push(`/user/bookshelf?pattern=${searchInput}`)
        break;
      default:
        router.push(`/serie/${router.query.serieId}?pattern=${searchInput}`)
    }
  }

  const handleChangeInput = (input) => {
    setSearchInput(input);
  }

  return (
    <div className={`${style["searchbox-2"]}`}>
      <input onChange={(e) => handleChangeInput(e.target.value)} placeholder={t('common:search')} type="text"/>
      <Button onClick={handleSearch}><img src={'/assets/icons/search_icon.svg'}></img></Button>
    </div>
  );
};
