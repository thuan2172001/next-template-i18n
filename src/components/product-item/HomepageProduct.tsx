import React from "react";
import { useTranslation } from "next-i18next";
import CustomImageField from "../image/index";

export const HomepageProduct = ({ productInfo }) => {
  const { t } = useTranslation();

  const {
    srcImg,
    isNewReleashed,
    usage = "customer"
  } = productInfo;

  const _displayQuantity = (quantity) => {
    if (!quantity || quantity <= 0) return `0 ${t("common:item")}`;

    if (quantity === 1) return `0 ${t("common:item")}`;

    return `${quantity} ${t("common:items")}`;
  };

  return (
    <div className="item">
      <div
        style={{
          position: "relative",
        }}
      >
          <CustomImageField
            width="260px"
            height="260px"
            src={srcImg}
            alt="nft"
            isNewRelease={isNewReleashed}
            borderSize="bold"
          />
      </div>

      {/* <div className="item-name text-color-light-orange">
        <span>{serieName ? serieName : ""}</span>
      </div>

      <div className="item-price-custom">
        <span className="text-color-light-black">
          {_displayQuantity(episodeQuantity)}
        </span>
      </div> */}
    </div>
  );
};
