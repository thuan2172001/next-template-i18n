import {useTranslation} from 'next-i18next'
import style from './episode.module.scss'
import {Row, Button, Divider} from 'antd'
import {PrivateItemModal} from './modal/PrivateItemModal'
import {useState} from 'react'
import {EpManagePendingModal} from '../episode-management/modal/PendingModal'

export const PublicItem = ({episodeInfo}) => {
  const {t} = useTranslation()

  const [modalType, setModalType] = useState('')
  const [isPending, setIsPending] = useState(episodeInfo?.isUnpublishPending)

  const FreeDetail = () => {
    return (
      <>
        <Row>
          <Button
            className={`${style['private-btn']}`}
            onClick={() => setModalType('private-item')}
          >
            {t('common:episode.privateItem')}
          </Button>
        </Row>
      </>
    )
  }

  const NonFreeDetail = () => {
    return (
      <>
        <div className={`${style["publish-action"]}`}>

          <Button
            className={`${style['private-btn']}`}
            onClick={() => setModalType('private-item')}
          >
            {t('common:episode.privateItem')}
          </Button>
        </div>
      </>
    )
  }

  return (
    <div>
      {episodeInfo?.isFree ? <FreeDetail/> : <NonFreeDetail/>}
      {modalType === 'private-item' && (
        <PrivateItemModal
          updateModalVisible={setModalType}
          episodeInfo={episodeInfo}
          showPendingModal={() => {
            if (!isPending) {
              setModalType('')
              setIsPending(true)
            }
          }}
        />
      )}
      {isPending && (
        <EpManagePendingModal
          updateModalVisible
          type="private"
          episodeName={episodeInfo?.name}
          serieId={episodeInfo?.serieId}
        />
      )}
    </div>
  )
}
