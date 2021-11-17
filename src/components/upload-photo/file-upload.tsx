import Image from "next/image";
import {useTranslation} from "next-i18next";
import {useRef, useState} from "react";
import style from "./upload-photo.module.scss";
import {Document, Page, pdfjs} from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const FileUpload = ({
                             className,
                             setFile,
                             errorMsg = "",
                             seriesInfo,
                             setCoverType,
                             hasCover,
                             validateAll,
                             setCoverErrMsg,
                           }) => {
  const {t} = useTranslation();

  const inputFile = useRef(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileExt, setFileExt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const containerRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");

  const onClickPreview = () => {
    setCoverErrMsg(`${t("create-series:inputCoverBeforePreview")}`);
    validateAll();
  };

  const onFileChange = async (e) => {
    validateAll();
    if (e.target.files.length !== 0) {
      let file = e.target.files[0];
      let lastDot = file.name.lastIndexOf(".");
      let ext = file.name.substring(lastDot + 1);
      let videoUrl = URL.createObjectURL(file);
      let bookUrl = "";

      if (ext == "pdf" || "png" || "jpeg" || "jpg") {
        bookUrl = URL.createObjectURL(file);
        window.localStorage.setItem("book-url", bookUrl);
      }

      if (
        ((ext === "pdf")  &&
          file.size < 50000000)
      ) {
        setFilePreview(file);
        setFileName(file.name);
        setFileExt(ext);
        setVideoUrl(videoUrl);
        setCoverType(ext);
        setImageUrl(bookUrl);
      }
      setFile({file: e.target.files[0]});
    } else console.log("Khong tai duoc");
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const emptyInput = () => {
    inputFile.current.value = null;
  };

  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({numPages}) {
    setNumPages(numPages);
  }

  return (
    <div
      ref={containerRef}
      className={`${style["file-content-upload"]} ${style[className]}`}
    >
      {filePreview && (
        <div
          className={`${style["trash-icon"]}`}
          onClick={() => {
            setFilePreview(null);
            emptyInput();
            setFile({});
            window.localStorage.removeItem("video-url");
            window.localStorage.removeItem("music-url");
            window.localStorage.removeItem("video-thumbnail");
          }}
        >
          <Image src="/assets/icons/trash.svg" width={41} height={41}/>
        </div>
      )}

      <div className={`${style["cover-photo-content"]}`}>
        <Image src="/assets/icons/cloud.png" height={74} width={74}/>

        <div className={`${style["cover-photo-header"]}`}>
          {t("create-series:uploadFile")}
        </div>

        <div className={`${style["cover-photo-subtitle"]}`}>
          <span
            className={`${style["text-color-pink"]}`}
            onClick={onButtonClick}
            style={{cursor: "pointer"}}
          >
            {t("create-series:browse")}
          </span>{" "}
          {t("create-series:chooseFile")}
        </div>

        <div className={`${style["file-upload-notice"]}`}>
          {t("create-series:fileUploadNotice")}
        </div>

        <input
          type="file"
          id="file"
          ref={inputFile}
          onChange={(e) => {
            onFileChange(e);
          }}
          accept="application/pdf, .epub, .png, .jpeg, .jpg, video/mp4, video/mpeg4, video/m4v, audio/mp3, audio/mpeg4"
          style={{display: "none"}}
        />
        {errorMsg !== "" && (
          <div className={`${style["error-msg"]}`}>
            <Image src="/assets/icons/invalid.svg" height={24} width={24}/>
            <div className={`${style["error-content"]}`}>{errorMsg}</div>
          </div>
        )}

        {filePreview && (
          <div className={`${style["file-preview"]}`}>
            {fileExt === "pdf" && (
              <a
                href={"/creator/create_episode/preview/document"}
                className={`${style["preview-container"]}`}
                target="_blank"
              >
                <Document
                  className={`${style["file-img"]}`}
                  file={filePreview}
                  renderMode="svg"
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <div className={`${style["preview-btn"]}`}>
                    <img src={"/assets/icons/preview.svg"}></img>
                  </div>
                  <Page
                    pageNumber={1}
                    className={`${style["pdf-canvas"]}`}
                    height={containerRef?.current?.offsetHeight * 0.8}
                  />
                </Document>
              </a>
            )}
            {(fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg") && (
              <div className={`${style["video-preview"]}`}>
                <img src={imageUrl}></img>
              </div>
            )}
            {fileExt === "epub" && (
              <div className={`${style["video-preview"]}`}>
                <img src={"/assets/icons/epub-default.png"}></img>
              </div>
            )}
            {(fileExt === "mp4" || fileExt === "m4v") && (
              <a
                onClick={onClickPreview}
                href={hasCover && "/creator/create_episode/preview"}
                style={{maxHeight: "80%"}}
                target="_blank"
              >
                <div className={`${style["video-preview"]}`}>
                  <div className={`${style["preview-btn"]}`}>
                    <img src={"/assets/icons/preview.svg"}></img>
                  </div>
                  {/*<VideoThumbnail videoUrl={videoUrl} />*/}
                </div>
              </a>
            )}
            {(fileExt === "mp3" || fileExt === "m4a") && (
              <a
                onClick={onClickPreview}
                href={hasCover && "/creator/create_episode/preview"}
                target="_blank"
              >
                <div className={`${style["video-preview"]}`}>
                  <div className={`${style["preview-btn"]}`}>
                    <img src={"/assets/icons/preview.svg"}></img>
                  </div>
                  <img src={"assets/icons/music-default.png"}></img>
                </div>
              </a>
            )}
            <div className={`${style["file-name"]}`}>{fileName}</div>
          </div>
        )}
      </div>
    </div>
  );
};
