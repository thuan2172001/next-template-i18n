import React, { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { EmptyCartTemplate } from "../../../layout/empty-cart";
import { CartTemplate } from "../../../layout/cart";
import { Header } from "@components/header";
import { SubHeader } from "@components/sub-header";
import { Footer } from "@components/footer";
import CustomerCartAPI from "../../../api/customer/cart";
import { useDispatch, useSelector, connect } from 'react-redux';
import { Skeleton } from "antd";

const CartPage = () => {
  const [selectedCate, setSelectedCate] = useState("all");
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      CustomerCartAPI.getCartData({ userInfo }).then(data => {
        if (data) {
          setData(data)
          dispatch({
            type: 'UPDATE_CART',
            payload: data.map((e) => e.episodeId),
          });
        }
        setLoading(false)
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
      <div style={{ minHeight: "100vh" }}>
        {data.length > 0 ?
          <CartTemplate
            cartList={data}
            getCartList={getCartList}
            isAllChecked={isAllChecked}
            getCartListGuest={getCartListGuest}
            cartLoading={loading}
          /> : <EmptyCartTemplate cartLoading={loading}/>}
      </div>
      <Footer />
    </React.Fragment>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home", "cart"])),
  },
});

export default connect(null, {})(CartPage);
