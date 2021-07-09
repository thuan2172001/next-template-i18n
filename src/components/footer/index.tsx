import React from 'react';
import Image from 'next/image';
import { Button, Space } from 'antd';
import { Menu, Dropdown } from 'antd';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export const Footer = ({ isHide = false }) => {
	const { t } = useTranslation();
	const router = useRouter();

	const scrollTo = (sectionName) => {
		if (typeof window !== 'undefined') {
			const element = document.getElementById(`${sectionName}-section`);

			if (router.pathname !== '/') {
				window.localStorage.setItem('routeSection', sectionName);
				router.push('/');
			}

			if (element) {
				const headerOffset = 88;

				window.scroll({
					top: element.offsetTop - headerOffset,
					behavior: 'smooth',
				});
			}
		}
	};

	if (isHide) return <></>;

	return (
		<div className="atn-footer">
			<Space direction="vertical" size="large">
				<Space align="center" size="middle">
					<div className="atn-footer-content">
						<div className="atn-footer-link-container atn-footer-text">
							<Button
								type="link"
								className="white-text"
								key="top"
								onClick={() => scrollTo('top')}>
								{t('common:section.top')} |
							</Button>

							<Button
								type="link"
								className="white-text"
								key="product"
								onClick={() => scrollTo('product')}>
								{t('common:section.product')} |
							</Button>

							<Button
								type="link"
								className="white-text"
								key="profile"
								onClick={() => scrollTo('profile')}>
								{t('common:section.profile')} |
							</Button>

							<Button
								type="link"
								className="white-text"
								key="support"
								onClick={() => scrollTo('support')}>
								{t('common:section.support.title')}
							</Button>

							{/* <Button
                type="link"
                className="white-text"
                key="login"
                onClick={() => scrollTo('login')}>
                {t('common:section.login')}
              </Button> */}
						</div>
						<span className="atn-footer-text-center">POWERED BY ARIUM</span>
						<span className="atn-footer-text">
							Copyright ©︎Masahiko Maesawa. All rights reserved.
						</span>
					</div>
				</Space>
			</Space>
		</div>
	);
};
