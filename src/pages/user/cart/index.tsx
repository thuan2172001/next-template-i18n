import React, { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { EmptyCartTemplate } from "../../../layout/empty-cart";
import { CartTemplate } from "../../../layout/cart";
import { Header } from "@components/header";
import { SubHeader } from "@components/sub-header";
// import { Footer } from "@components/footer";
import CustomerCartAPI from "../../../api/customer/cart";
import { useDispatch, useSelector, connect } from 'react-redux';

const CartPage = () => {
  const [selectedCate, setSelectedCate] = useState("all");
  const [selectedSubCate, setSelectedSubCate] = useState("");
  const [data, setData] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const cartList = useSelector((state: any) => state.cart?.cartList);

  const dispatch = useDispatch();

  useEffect(() => {
    getCartList()
  }, [])

  const getCartList = () => {
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    if (userInfo) {
      CustomerCartAPI.getCartData({ userInfo }).then(data => {
        if (data) {
          console.log({ data })
          setData(data)
          dispatch({
            type: 'UPDATE_CART',
            payload: data.map(e => e.episodeId),
          });
        }
      })
    } else {
      getCartListGuest(cartList)
    }
  }

  const getCartListGuest = (tmpCartList) => {
    setData(tmpCartList)
    let tmpIsAllChecked = true;
    tmpCartList.forEach((cart) => {
      if (!cart.isCheck) {
        tmpIsAllChecked = false;
      }
    })
  }

  return (
    <React.Fragment>
      <Header />
      <SubHeader
        selectedCate={selectedCate}
        setSelectedCate={setSelectedCate}
      />
      {data?.length > 0 ?
        <CartTemplate
          cartList={data}
          getCartList={getCartList}
          isAllChecked={isAllChecked}
          getCartListGuest={getCartListGuest}
        /> : <EmptyCartTemplate />}
      {/* <Footer /> */}
    </React.Fragment>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home", "cart"])),
  },
});

export default connect(null, {})(CartPage);
