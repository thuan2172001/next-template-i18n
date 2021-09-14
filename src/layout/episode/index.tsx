import {Col, Row, Skeleton, Button} from "antd";
import React, {useState, useEffect} from "react";
import {useTranslation} from "next-i18next";
import CustomImageField from "@components/image";
import style from "./episode.module.scss";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";
import CustomerEpisodeAPI from "../../api/customer/episode";
import CustomerCartAPI from "../../api/customer/cart";
import CustomerBookshelfAPI from "../../api/customer/bookshelf";
import {GetUserInfo} from "../../api/user";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {NonPurchasedItem} from "./NonPurchasedItem";
// import { ShareModal } from "@components/share-modal";
// import { RequireLoginModal } from "@components/modal/RequireLoginModal";
// import ProofAuthenticityTemplate from "../proof-authenticity";
// import BlockChainDetailTemplate from "../blockchain-detail";
// import { Ribbon } from "@components/ribbon-tag/index";
import EpisodeManagementAPI from "../../api/episode-management/episode-management";
// import { NonPurchasedItem } from "./NonPurchasedItem";
// import { PurchasedItem } from "./PurchasedItem";
// import { PublicItem } from "./PublicItem";
// import { PrivateItem } from "./PrivateItem";

const EpisodeTemplate = ({seriesId, episodeId}) => {
    const {t} = useTranslation();
    const router = useRouter();

    const [shareModal, setShareModal] = useState(false);
    let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));

    // const showPopUpShare = () => {
    //     if (!isCreatorMode) {
    //         setShareModal(true);
    //     }
    // };

    const dispatch = useDispatch();

    // const cartList = useSelector((state: any) => state.cart.cartList);

    const [favorite, setFavorite] = useState(false);
    const [amount, setAmount] = useState(1);
    const [amountInCart, setAmountInCart] = useState(0);
    const [episodeInfo, setEpisodeInfo] = useState<any>({});
    // const [addedToBookshelf, setAddedToBookshelf] = useState(false);
    // const [isLogged, setIsLogged] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [episodeTotalLikes, setTotalLikes] = useState(0);

    const onClickFavorite = () => {
        // if (!isLogged) setModalVisible(true);
        console.log(favorite);
        favorite ?
            EpisodeManagementAPI.unlike({
                userInfo: GetUserInfo(),
                episodeId: episodeId,
            }).then((res) => {
                console.log(res);
                if (res.data == "success") {
                    setFavorite(false);
                    setTotalLikes(episodeTotalLikes - 1);
                }
            }) : EpisodeManagementAPI.like({
                userInfo: GetUserInfo(),
                episodeId: episodeId,
            }).then((res) => {
                console.log(res);
                if (res.data == "success") {
                    setFavorite(true);
                    setTotalLikes(episodeTotalLikes + 1);
                }
            })
    };

    // const [isCreatorMode, setCreatorMode] = useState(false);
    //
    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         userInfo =
    //             window.localStorage && window.localStorage.getItem("userInfo")
    //                 ? JSON.parse(window.localStorage.getItem("userInfo"))
    //                 : {};
    //
    //         if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
    //             setIsLogged(true);
    //             if (userInfo.role.role === "creator") setCreatorMode(true);
    //         } else {
    //             setIsLogged(false);
    //         }
    //     }
    // }, [userInfo]);

    useEffect(() => {
        fetchData();
    }, [episodeId]);

    // const [isPurchasedItem, setIsPurchased] = useState(false);

    const fetchData = () => {
        if (episodeId) {
            CustomerEpisodeAPI.getEpisodeInfo({
                userInfo: GetUserInfo(),
                episodeId: episodeId,
            }).then((response) => {
                const episode = response.data || response;
                setEpisodeInfo({
                    ...episode,
                });
                setFavorite(episode?.alreadyLiked);
                setTotalLikes(episode?.likes);
                // setIsPurchased(episode?.numEditionInBookshelf !== null);
                // setAddedToBookshelf(episode?.addedToBookshelf);
            });
        }
        // cartList.forEach((cart) => {
        //     if (cart.episode._id === episodeId || cart.episode === episodeId)
        //         setAmountInCart(cart.quantity);
        // });
    };

    // const getCartList = () => {
    //     const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    //     CustomerCartAPI.getCart({ userInfo }).then((res) => {
    //         if (res.cartItems) {
    //             dispatch({
    //                 type: "UPDATE_CART",
    //                 payload: res.cartItems,
    //             });
    //             res.cartItems.forEach((cart) => {
    //                 if (cart.episode._id === episodeId || cart.episode === episodeId)
    //                     setAmountInCart(cart.quantity);
    //             });
    //         }
    //     });
    // };

    // const addToBookshelf = () => {
    //     if (!isLogged) setModalVisible(true);
    //     else {
    //         CustomerBookshelfAPI.addFreeEpToBookshelf({
    //             userInfo: GetUserInfo(),
    //             episodeId,
    //         })
    //             .then(() => {
    //                 setAddedToBookshelf(true);
    //             })
    //             .catch();
    //     }
    // };

    // const moveToSeriePage = () => {
    //     if (!isCreatorMode) {
    //         const pathname = "/serie/" + seriesId;
    //         router.push(pathname);
    //     }
    // };
    //
    // const moveToShop = () => {
    //     !isCreatorMode && router.push(`/shop/${episodeInfo?.author.id}`);
    // };
    //
    // const handleAddToCart = () => {
    //     const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    //     if (userInfo) {
    //         CustomerCartAPI.updateCart({
    //             userInfo,
    //             episodeId: episodeInfo._id,
    //             quantity: amount + amountInCart,
    //         }).then(() => {
    //             getCartList();
    //         });
    //     } else {
    //         let isNew = true;
    //         let newCartList = cartList.map((cart) => {
    //             if (
    //                 cart.episode._id === episodeInfo._id ||
    //                 cart.episode === episodeInfo._id
    //             ) {
    //                 isNew = false;
    //                 return {
    //                     ...cart,
    //                     quantity:
    //                         amount + amountInCart > episodeInfo?.forSaleEdition
    //                             ? episodeInfo?.forSaleEdition
    //                             : amount + amountInCart,
    //                 };
    //             }
    //             return cart;
    //         });
    //
    //         if (isNew) {
    //             newCartList.unshift({
    //                 episode: {
    //                     _id: episodeInfo?._id,
    //                     authorName: episodeInfo?.author?.name,
    //                     episodeName: episodeInfo?.name,
    //                     maxNumberCanBuy: episodeInfo?.forSaleEdition,
    //                     thumbnail: episodeInfo?.thumbnail,
    //                 },
    //                 isCheck: true,
    //                 price: episodeInfo?.price,
    //                 quantity:
    //                     amount > episodeInfo?.forSaleEdition
    //                         ? episodeInfo?.forSaleEdition
    //                         : amount,
    //             });
    //         }
    //
    //         newCartList = newCartList.filter((cart) => cart.quantity > 0);
    //         dispatch({
    //             type: "UPDATE_CART",
    //             payload: newCartList,
    //         });
    //
    //         newCartList.forEach((cart) => {
    //             if (cart.episode._id === episodeId || cart.episode === episodeId)
    //                 setAmountInCart(cart.quantity);
    //         });
    //     }
    // };

    // const formatTotalLike = (likes) => {
    //     if (!likes) return 0;
    //     if (likes >= 1000000) return Math.floor(likes / 1000000) + "M";
    //     if (likes >= 1000) return Math.floor(likes / 1000) + "K";
    //     return likes;
    // };

    return (
        <div className={style.nft}>
            {/*<ShareModal*/}
            {/*    visible={shareModal}*/}
            {/*    setVisible={setShareModal}*/}
            {/*    content={episodeInfo?._id}*/}
            {/*    imageUrl={episodeInfo.thumbnail}*/}
            {/*/>*/}

            <Row gutter={30}>
                <Col span={12}>
                    <Skeleton active loading={!episodeInfo?.thumbnail}>
                        <div className="nft-image" style={{position: "relative"}}>
                            {/* {episodeInfo?.isPublishing &&
                episodeInfo?.forSaleEdition == 0 &&
                !episodeInfo?.isFree && (
                  <Ribbon link={"soldout"} className={["detail-soldout"]} />
                )} */}
                            {/*{isCreatorMode && !episodeInfo?.isPublishing && (*/}
                            {/*    <Ribbon link={"private"} className={["detail-private"]} />*/}
                            {/*)}*/}
                            <CustomImageField
                                width={"454"}
                                height={"454"}
                                src={episodeInfo.thumbnail}
                                alt="nft"
                                isNewRelease={false}
                                borderSize="bold"
                                isPublished={true}
                                isSoldOut={false}
                            />
                        </div>
                    </Skeleton>
                </Col>

                <Col span={12}>
                    <div className={style["product-detail"]}>
                        <div className={style["name-container"]}>
                            <Skeleton
                                active
                                paragraph={{rows: 0}}
                                loading={!episodeInfo?.name}
                            >
                                <h2 className={style["nft-name"]}>{episodeInfo?.name}</h2>
                            </Skeleton>
                        </div>

                        <div>
                            <Skeleton
                                active
                                paragraph={{rows: 0}}
                                loading={!episodeInfo?.serie}
                            >
                                <span
                                    className={`${style["series-link"]} ${style["cursor_pointer"]
                                }`}
                                    // onClick={moveToSeriePage}
                                >
                                    {episodeInfo?.serie?.serieName}
                                </span>
                            </Skeleton>
                        </div>

                        <div className={style["category-row"]}>
                            <span>
                                {favorite ? (
                                    <HeartFilled
                                        className={`${style["favorite-icon"]} ${style["color-red"]}`}
                                        onClick={onClickFavorite}
                                    />
                                ) : (
                                    <HeartOutlined
                                        className={`${style["favorite-icon"]}`}
                                        onClick={onClickFavorite}
                                    />
                                )}
                                {/*      <HeartOutlined*/}
                                {/*          className={`${style["favorite-icon"]}`}*/}
                                {/*          onClick={onClickFavorite}*/}
                                {/*      />*/}
                            </span>
                            <span className={style["likes"]}>
                                {" "}
                                {episodeTotalLikes}{" "}
                            </span>

                            <span>
                                <img src={"/assets/icons/separate-line.svg"} width={1} height={22}/>
                            </span>

                            <span className={style["category-list"]}>
                                <span className={style["category-name"]}>
                                    {episodeInfo?.category?.categoryName}
                                </span>
                            </span>
                        </div>

                        <div>
                            <img
                                className={`${style["dotted-line"]}`}
                                src={"/assets/icons/dotted-line.svg"}
                                height={2}
                            />
                        </div>

                        <Row>

                            <Col xs={1}>
                                <img
                                    src={"assets/icons/share/share-link.svg"}
                                    onClick={() => {
                                    }}
                                    className={`${style["share-btn"]} ${style["cursor_pointer"]
                                    }`}
                                />
                            </Col>
                        </Row>
                        {/*{!isCreatorMode && isPurchasedItem && (*/}
                        {/*    <PurchasedItem*/}
                        {/*        episodeInfo={episodeInfo}*/}
                        {/*        handleBuyMoreEdition={() => setIsPurchased(false)}*/}
                        {/*        serieId={seriesId}*/}
                        {/*    />*/}
                        {/*)}*/}
                        {/*{!isCreatorMode && !isPurchasedItem && (*/}
                        <NonPurchasedItem
                            serieId={seriesId}
                            episodeInfo={episodeInfo}
                            // addedToBookshelf={addedToBookshelf}
                            handelAddToBookshelf={() => {
                            }}
                            setCartAmount={({count}) => {
                                setAmount(count);
                            }}
                            handleAddToCart={() => {
                            }}
                        />
                        {/*)}*/}
                        {/*{isCreatorMode && episodeInfo?.isPublishing && (*/}
                        {/*    <PublicItem episodeInfo={episodeInfo} />*/}
                        {/*)}*/}
                        {/*{isCreatorMode && !episodeInfo?.isPublishing && (*/}
                        {/*    <PrivateItem episodeInfo={episodeInfo} />*/}
                        {/*)}*/}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={24} className={`${style["description"]}`}>
                    <Skeleton
                        active
                        loading={
                            episodeInfo?.description !== "" && !episodeInfo?.description
                        }
                    >
                        {episodeInfo?.description}
                    </Skeleton>
                </Col>
            </Row>

            {/*{modalVisible && (*/}
            {/*    <RequireLoginModal*/}
            {/*        updateModalVisible={() => setModalVisible(false)}*/}
            {/*        isFrom={`nft?serieId=${seriesId}&episodeId=${episodeId}`}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
};

export default EpisodeTemplate;
