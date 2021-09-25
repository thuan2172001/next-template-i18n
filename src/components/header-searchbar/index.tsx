import React from 'react';
import Image from 'next/image';
import { Button, Space } from 'antd';
import { Menu, Dropdown } from 'antd';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import style from './header-searchbar.module.scss';

export const SearchBar2 = () => {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<div className={`${style["searchbox-2"]}`}>
			<input placeholder="Search" type="text"/>
            <Button><img src={'/assets/icons/search_icon.svg'}></img></Button>
		</div>
	);
};
