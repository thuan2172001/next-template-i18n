import style from "./read.module.scss";
import { useState, useEffect, useRef } from "react";
import ReadAPI from "../../api/read/read";
import { ReadError } from "./ReadErr";
import { GetUserInfo } from "src/api/auth";

export const Read = ({
  setting,
  serieId,
  episodeId,
  isAreaChange = false,
  currentEps,
  setShowHeader = null,
}) => {
  const { animation, speed, area } = setting;

  const [pageNumber, setPageNumber] = useState(0);
  const [pages, setPages] = useState([]);
  const [currentView, setCurrentView] = useState(0);
  const [slidesDirection, setSlidesDirection] = useState([]);
  const [checkpointState, setCheckpointState] = useState(null);

  useEffect(() => {
    const checkpoint = window.localStorage.getItem("read")
      ? JSON.parse(window.localStorage.getItem("read"))
      : {};
    let initPages = [1, 2, 3, 4, 5];
    let tmpPages = [];
    let isCheckPoint = false;
    if (checkpoint && checkpoint[episodeId]) {
      const checkPointData = checkpoint[episodeId];
      if (checkPointData["page"] && checkPointData["pageNumber"]) {
        isCheckPoint = true;
        initPages = getInitPage(
          checkPointData["page"],
          checkPointData["pageNumber"]
        );
        tmpPages = new Array(checkPointData["pageNumber"]);
        setCurrentView(checkPointData["page"]);
      }
    }

    ReadAPI.getRead({
      userInfo: GetUserInfo(),
      serieId,
      episodeId,
      pages: JSON.stringify(initPages),
    })
      .then((res) => {
        if (res?.episode && res?.signedUrl && res?.signedUrl?.length > 0) {
          res?.signedUrl?.forEach((url, index) => {
            tmpPages[initPages[index] - 1] = {
              url,
              page: initPages[index],
            };
          });
          setPages(tmpPages);
          setPageNumber(res.episode.pageNumber);
          if (!isCheckPoint) {
            checkpoint[episodeId] = {
              page: 1,
              pageNumber: res.episode.pageNumber,
            };
            setCurrentView(1);
          }
        }

        window.localStorage.setItem("read", JSON.stringify(checkpoint));
        setCheckpointState(checkpoint);
      })
      .catch(() => {
        window.localStorage.setItem("read", JSON.stringify(checkpoint));
        setCheckpointState(checkpoint);
      });
  }, [episodeId]);

  const getInitPage = (pageSave, pageNumber) => {
    if (pageSave <= 3) return [1, 2, 3, 4, 5];
    if (pageSave >= pageNumber - 2)
      return [
        pageNumber - 4,
        pageNumber - 3,
        pageNumber - 2,
        pageNumber - 1,
        pageNumber,
      ];
    return [pageSave - 2, pageSave - 1, pageSave, pageSave + 1, pageSave + 2];
  };

  const handleNext = () => {
    if (currentView < pageNumber) {
      slidesDirection[currentView - 1] = "next-for-current";
      slidesDirection[currentView] = "next-for-hidden";

      if (checkpointState) {
        console.log({ checkpointState });
        checkpointState[episodeId] = {
          page: currentView + 1,
          pageNumber,
        };
        window.localStorage.setItem("read", JSON.stringify(checkpointState));
        setCheckpointState(checkpointState);
      }

      setCurrentView(currentView + 1);

      if (pages[currentView - 1]) getMorePage(pages[currentView - 1].page + 3);
    }
  };

  const handlePrev = () => {
    if (currentView > 1) {
      slidesDirection[currentView - 1] = "prev-for-current";
      slidesDirection[currentView - 2] = "prev-for-hidden";

      if (checkpointState) {
        checkpointState[episodeId] = {
          page: currentView - 1,
          pageNumber,
        };
        window.localStorage.setItem("read", JSON.stringify(checkpointState));
        setCheckpointState(checkpointState);
      }

      setCurrentView(currentView - 1);

      if (pages[currentView - 1]) getMorePage(pages[currentView - 1].page - 3);
    }
  };

  const getMorePage = (page) => {
    if (
      pages.filter((pageValue) => pageValue.page == page).length == 0 &&
      page <= pageNumber &&
      page > 0
    ) {
      ReadAPI.getRead({
        userInfo: GetUserInfo(),
        serieId,
        episodeId,
        pages: JSON.stringify([page]),
      })
        .then((res) => {
          if (res.episode && res.signedUrl.length > 0) {
            pages[page - 1] = {
              url: res.signedUrl[0],
              page,
            };
            setPages(pages);
          }
        })
        .catch();
    }
  };

  const handleOnKeyPress = (event) => {
    event.keyCode === 39 && handlePrev();
    event.keyCode === 37 && handleNext();
  };

  const handleOnWheel = (event) => {
    const type = event?.nativeEvent?.wheelDelta > 0 ? "down" : "up";
    type === "down" ? handlePrev() : handleNext();
  };

  const handleOnClick = (event) => {
    setShowHeader();
  };

  if (currentEps && currentEps.isLocked)
    return <ReadError data={currentEps} onWrapperClick={setShowHeader} />;

  return (
    <>
      <div
        className={`${style["cursor-area1"]} ${
          isAreaChange && style["display-tapping-area"]
        } ${currentView < pageNumber && style["cursor-left"]}`}
        style={{ width: `${area}%` }}
        onClick={handleNext}
      ></div>
      <div
        className={`${style["cursor-area2"]} ${
          isAreaChange && style["display-tapping-area"]
        } ${currentView > 1 && style["cursor-right"]}`}
        style={{ width: `${area}%` }}
        onClick={handlePrev}
      ></div>

      {pages && pages.length > 0 && (
        <div
          className={`${style["wrapper"]}`}
          onKeyDown={handleOnKeyPress}
          onWheel={handleOnWheel}
          onClick={handleOnClick}
          tabIndex={0}
        >
          {pages?.map((page, index) =>
            page ? (
              <div
                className={`${style["slide"]} ${
                  style[slidesDirection[index]]
                } ${animation === "none" && style["turn-off-animation"]} ${
                  style[speed]
                }`}
                style={{ left: `${(page.page - currentView) * 100}%` }}
                key={`trans_${index}`}
              >
                <div className={`${style["main-content"]}`}>
                  <img src={page.url} alt={`page ${index}`} />
                </div>
              </div>
            ) : (
              <div
                className={`${style["slide"]} ${
                  style[slidesDirection[index]]
                } ${animation === "none" && style["turn-off-animation"]} ${
                  style[speed]
                }`}
                style={{ left: `${(page.page - currentView) * 100}%` }}
                key={`trans_${index}`}
              >
                <div className={`${style["main-content"]}`}></div>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};
