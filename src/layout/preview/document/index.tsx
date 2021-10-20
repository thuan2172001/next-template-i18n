import style from "../../read/read.module.scss";

// @ts-ignore
import { SpecialZoomLevel, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import { ReadHeader } from "../../../layout/read/header";

import { useState, useEffect } from "react";
import { Worker, PageChangeEvent } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import disableScrollPlugin from "./disableScroll";
const initialState = {
  animation: "none",
  speed: "fast",
  area: 40,
};
import {
  pageNavigationPlugin,
  RenderCurrentPageLabelProps,
} from "@react-pdf-viewer/page-navigation";

export const DocumentTemplate = ({ serieId, episodeId }) => {
  const disableScrollPluginInstance = disableScrollPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const [showHeader, setShowHeader] = useState(true);
  const [setting, setSetting] = useState(initialState);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [currentEps, setCurrentEps] = useState({
    isFavorite: false,
    totalLikes: 0,
    episodeId: "abc",
    name: "Preview",
  });
  const { animation, speed, area } = setting;
  const { CurrentPageLabel, jumpToPage } = pageNavigationPluginInstance;

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleOnWheel = (event) => {
    const type = event?.nativeEvent?.wheelDelta > 0 ? "down" : "up";
    type === "down" ? handlePrev() : handleNext();
  };

  const handleOnKeyPress = (event) => {
    event.keyCode === 39 && handlePrev();
    event.keyCode === 37 && handleNext();
  };

  const [pointerClassName, setPointerClassName] = useState("");
  const handlePointerMove = (event) => {
    const { pageX } = event;

    // pageX <= (area / 100) * window.innerWidth &&
    //   currentPage != 0 &&
    //   setPointerClassName("cursor-left");
    // pageX > (area / 100) * window.innerWidth &&
    //   pageX < ((100 - area) / 100) * window.innerWidth &&
    //   setPointerClassName("cursor-mid");
    // if (pageX > ((100 - area) / 100) * window.innerWidth) {
    //   if (currentPage < totalPage - 1) setPointerClassName("cursor-right");
    //   else setPointerClassName("cursor-mid");
    // }

    if (pageX <= (area / 100) * window.innerWidth) {
      if (currentPage < totalPage - 1) setPointerClassName("cursor-left");
      else setPointerClassName("cursor-mid");
    }
    pageX > (area / 100) * window.innerWidth &&
      pageX < ((100 - area) / 100) * window.innerWidth &&
      setPointerClassName("cursor-mid");
    if (pageX > ((100 - area) / 100) * window.innerWidth) {
      if (currentPage != 0) setPointerClassName("cursor-right");
      else setPointerClassName("cursor-mid");
    }
  };

  const handleOnClick = (event) => {
    const { pageX } = event;

    if (pageX <= (area / 100) * window.innerWidth) {
      if (currentPage < totalPage - 1) handleNext();
      else setPointerClassName("cursor-mid");
    }
    if (
      pageX > (area / 100) * window.innerWidth &&
      pageX < ((100 - area) / 100) * window.innerWidth
    ) {
      setShowHeader(!showHeader);
      if (!showHeader) {
        setTimeout(() => {
          setShowHeader(showHeader);
        }, 2000);
      }
    }

    if (pageX > ((100 - area) / 100) * window.innerWidth) {
      if (currentPage != 0) handlePrev();
      else setPointerClassName("cursor-mid");
    }
  };

  useEffect(() => {
    jumpToPage(currentPage);
  }, [currentPage]);
  const handlePageChange = (e: PageChangeEvent) => {
    localStorage.setItem("current-page", `${e.currentPage}`);
  };
  return (
    <>
      <div>
        <div>
          <ReadHeader
            settingData={setting}
            setSettingData={() => {}}
            setAreaIsChanging={() => {}}
            setAreaDisappear={() => {}}
            setShowHeader={({ showHeader }) => setShowHeader(showHeader)}
            seriesData={null}
            preEps={null}
            currentEps={currentEps}
            nextEps={null}
            showHeader={showHeader}
          />
        </div>

        <div
          style={{
            height: "100vh",
            position: "relative",
          }}
          className={`${style["rpv-core__viewer"]} ${style[pointerClassName]}`}
          onWheel={handleOnWheel}
          onPointerMove={handlePointerMove}
          onClick={handleOnClick}
          onKeyDown={handleOnKeyPress}
          tabIndex={0}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js"></Worker>
          <div
            style={{
              left: 0,
              position: "absolute",
              top: "50%",
              transform: "translate(24px, -50%)",
              zIndex: 1,
            }}
          >
            <CurrentPageLabel>
              {(props: RenderCurrentPageLabelProps) => {
                if (totalPage == 0) {
                  setTotalPage(props.numberOfPages);
                }
                return <span></span>;
              }}
            </CurrentPageLabel>
          </div>

          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translate(-24px, -50%)",
              zIndex: 1,
            }}
          ></div>

          <Viewer
            fileUrl={window.localStorage.getItem("book-url")}
            plugins={[
              disableScrollPluginInstance,
              pageNavigationPluginInstance,
            ]}
            theme="dark"
            onPageChange={handlePageChange}
            defaultScale={SpecialZoomLevel.PageFit}
          />
        </div>
      </div>
    </>
  );
};
