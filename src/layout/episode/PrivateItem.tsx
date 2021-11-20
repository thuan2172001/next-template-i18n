import { useTranslation } from "next-i18next";
import style from "./episode.module.scss";
import { Row, Button, Divider } from "antd";
import { PublishFreeItemModal } from "./modal/PusblishFreeItemModal";
import { PublishNonFreeItemModal } from "./modal/PublishNonFreeItemModal";
import { useState, useEffect, useMemo } from "react";
import { EpManagePendingModal } from "../episode-management/modal/PendingModal";

export const PrivateItem = ({
  episodeInfo,
  updatePublishInPrivateSerie = null,
}) => {
  const { t } = useTranslation();
  const [modalType, setModalType] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(episodeInfo?.isPublishPending);
  }, [episodeInfo?.isPublishPending]);

  useMemo(() => {
    if (
      (episodeInfo?.isFree && episodeInfo?.burnQuantity === 0) ||
      (!episodeInfo?.isFree && episodeInfo?.inventoryEdition > 0)
    ) {
      setModalType(window.localStorage.getItem("modalType"));
      window.localStorage.removeItem("modalType");
    }
    if (episodeInfo != null) {
      window.localStorage.removeItem("modalType");
    }
  }, [episodeInfo]);

  const handlePublish = (modalType: string) => {
    setModalType(modalType);
  };

  const FreeDetail = () => {
    return (
      <>
            <Button
              className={`${style["publish-btn"]} ${
                episodeInfo?.inventoryEdition === 0 && style["disabled-button"]
              }`}
              onClick={() => {
                handlePublish("publish-free");
              }}
              disabled={episodeInfo?.inventoryEdition === 0}
            >
              {t("common:episode.publishItem")}
            </Button>
      </>
    );
  };

  const NonFreeDetail = () => {
    return (
      <>
        <Row>
          <div className={`${style["publish-action"]}`}>
            <Button
              className={`${style["publish-btn"]} ${
                episodeInfo?.inventoryEdition === 0 &&
                episodeInfo?.purchasedQuantity === 0 &&
                style["disabled-button"]
              }`}
              onClick={() => {
                handlePublish("publish-nonfree");
              }}
              disabled={
                episodeInfo?.inventoryEdition === 0 &&
                episodeInfo?.purchasedQuantity === 0
              }
            >
              {t("common:episode.publishItem")}
            </Button>
          </div>
        </Row>
      </>
    );
  };

  return (
    <div>
      {episodeInfo?.isFree ? <FreeDetail /> : <NonFreeDetail />}
      {modalType === "publish-free" && (
        <PublishFreeItemModal
          updateModalVisible={setModalType}
          episodeInfo={episodeInfo}
          showPendingModal={() => {
            if (!isPending) {
              setModalType("");
              setIsPending(true);
            }
          }}
        />
      )}
      {modalType === "publish-nonfree" && (
        <PublishNonFreeItemModal
          updateModalVisible={setModalType}
          episodeInfo={episodeInfo}
          showPendingModal={() => {
            if (!isPending) {
              setModalType("");
              setIsPending(true);
            }
          }}
        />
      )}
      {isPending && (
        <EpManagePendingModal
          updateModalVisible
          type="publish"
          episodeName={episodeInfo?.name}
          serieId={episodeInfo?.serieId}
        />
      )}
    </div>
  );
};
