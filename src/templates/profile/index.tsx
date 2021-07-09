import React, { useEffect, useState } from 'react';
import { Image, Row } from 'antd';
import { Button } from 'antd';
import { TwitterEmbbed } from '../../components/twitter-homepage/index';
import './profile.module.scss';

const getMediaImage = (mediaLink, index) => {
	let urlImage = `media-default${index + 1}`;
	if (mediaLink?.includes('instagram')) {
		urlImage = 'instagram';
	} else if (mediaLink?.includes('facebook')) {
		urlImage = 'facebook';
	} else if (mediaLink?.includes('twitter')) {
		urlImage = 'twitter';
	} else if (mediaLink?.includes('linkedin')) {
		urlImage = 'linkedin';
	} else if (mediaLink?.includes('youtube')) {
		urlImage = 'youtube';
	} else if (mediaLink?.includes('pinterest')) {
		urlImage = 'youtube';
	}
	return (
		<img src={`/icons/${urlImage}.png`} width="54vw" />
	);
};

const authorData = {
	name: '前沢雅彦',
	alphabetName: 'MAESAWA MASAHIKO',
	mediaLinks: [
		'https://www.facebook.com/picassleonard/',
		'https://www.instagram.com/byark.bp/',
		'https://twitter.com/billgates',
	],
	introduction:
		'コンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーランス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。コンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーランス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。コンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーランス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。',
};

const SocialMediaItem = ({ mediaLink, index }) => {
	return (
		<Button type="link" href={mediaLink ? `${mediaLink}` : '#'} target="_blank">
			{getMediaImage(mediaLink, index)}
		</Button>
	);
};

const Profile = (props) => {
	const [mediaLinks, setMediaLinks] = useState<any>();
	useEffect(() => {
		setMediaLinks(
			authorData.mediaLinks.map((mediaLink, i) => (
				<div style={{ width: "20%" }} key={i}>
					<SocialMediaItem mediaLink={mediaLink} index={i} />
				</div>
			))
		);
	}, []);

	return (
		<div className="profile_template">
			<div className="main-section1">
				<article className="main-section-item1">
					<div className="black-container">
						<div className="profile-image thumbnail">
							<Image
								className="profile-avatar"
								src="/icons/new-avatar.svg"
								preview={false}
							/>
						</div>

						<div className="author-name">
							{authorData.name} <br />
							{authorData.alphabetName}
						</div>

						<div className="introduction">{authorData.introduction}</div>
					</div>
				</article>
				<article className="main-section-item2">
					<div className="profile-facebook-content">
						<TwitterEmbbed />
					</div>
					<Row className='social-media-links'>{mediaLinks}</Row>
				</article>
			</div>
		</div>
	);
};

export default Profile;
