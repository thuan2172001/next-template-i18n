import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const ActiveLink = ({ path, className, order, tabName, subClassname = "" }) => {
  const router = useRouter();
  return (
    <div
      className={`${
        router.pathname === path ? "tab-active" : "creator-tab"
      } ${className}`}
    >
      <span
        className={`tab-order ${
          router.pathname === path ? "order-active" : ""
        }  ${subClassname}`}
      >
        {order}
      </span>
      <span>{tabName}</span>
    </div>
  );
};

export const CreatorLayout: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="layout creator-layout">
      <ActiveLink
        path="/creator/create_serie"
        className="creator-tab"
        order="1"
        tabName={t("create_serie:createSerie")}
        subClassname={`${
          router.pathname === "/creator/create_episode" ? "is-creating-ep" : ""
        }`}
      />

      <ActiveLink
        path="/creator/create_episode"
        className="creator-tab"
        order="2"
        tabName={t("create_serie:createEpisode")}
      />
    </div>
  );
};
