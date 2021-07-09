import React, {useState} from "react";
import { Modal} from "antd";
import Image from "next/image";
import { useRouter } from "next/router";

export const SuccessPublishModal = ({ type = "", serieId, episodeId='', isSuccess, nameEp="", setIsNotify }) => {
  const [isVisible, setIsVisible] = useState(true)

  const router = useRouter();

  const handleSeeInEpisodeBtn = () => {
    if(type == 'nft') {
      // go to unpublish
      router.push(`/em/${serieId}?publishTag=false`)
    } 
    if(type == 'publish' || type == 'unpublish') {
      // go to product detail
      router.push(`/nft?serie=${serieId}&episode=${episodeId}`)
    }

    setIsVisible(false)
    setIsNotify(false)
  }

  return (
    <Modal visible={isVisible} footer={null} closable={false} maskClosable={false}>
      <div className="modal-common">
        
        {
            isSuccess ?
            <div className="confirm-icon">
                <Image src="/icons/success.png" height={56} width={56} />
            </div>
            :
            <div className="confirm-icon">
                <Image src="/icons/failed-payment.svg" height={56} width={56} />
            </div>
        }

        {!isSuccess && type === "publish" && (
          <div className={`failed-message-1`}>{"Oh no! NFT publishing failed."}</div>
        )}

        {!isSuccess && type === "unpublish" && (
          <div className={`failed-message-1`}>{"Oh no! NFT unpublishing failed"}</div>
        )}

        {!isSuccess && type === "nft" && (
          <div className={`failed-message-1`}>{"Oh no! NFT created failed."}</div>
        )}

        {!isSuccess && (
          <div className={`failed-message-detail`}>{"Please make sure your TOMO balance suffices."}</div>
        )}

        {isSuccess && type === "publish" && (
          <div className="text-center">
                <div className={`success-messages`}>{"Successfully published "}</div>
                <div className={`ep-name`}>{nameEp}</div>
          </div>
        )}

        {isSuccess && type === "unpublish" && (
          <div className="text-center">
                <div className={`success-messages`}>{"Successfully unpublished "}</div>
                <div className={`ep-name`}>{nameEp}</div>
          </div>
        )}

        {isSuccess && type === "nft" && (
          <div className="text-center">
                <div className={`success-messages`}>{"Successfully created "}</div>
                <div className={`ep-name`}>{nameEp}</div>
          </div>
        )}

        {
            isSuccess ?
            <div className="custom-modal-footer">
                <div
                className="footer-button save-active m-r-10"
                onClick={() => {
                  handleSeeInEpisodeBtn()
                }}
                >
                See in Episode
                </div>
                <div
                className="footer-button btn-black-white m-l-10"
                onClick={() => {
                    setIsVisible(false)
                    setIsNotify(false)
                    if(router.query.serieId) {
                      window.location.reload()
                    }
                }}
                >
                Close pop-up
                </div>
            </div>
            :
            <div className="custom-modal-footer">
                <div
                className="footer-button save-active"
                onClick={() => {
                    router.push(`/nft?serie=${serieId}&episode=${episodeId}`)
                    setIsVisible(false)
                    setIsNotify(false)
                }}
                >
                Try again
                </div>
            </div>
        }
      </div>
    </Modal>
  );
};
