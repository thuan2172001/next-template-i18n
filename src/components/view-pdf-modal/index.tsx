import React, { useState } from "react";
import Image from "next/image";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import { Modal } from "antd";

export const ViewSupport = ({ updateVisible, fileSrc }) => {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
      <Modal visible={true}>
        <div className="view-support-container" tabIndex={-1}>
          <div className="view-head">
            <div
                className="close-btn"
                onClick={() => {
                  updateVisible({ show: false });
                  localStorage.setItem("routeSection", "support");
                }}
            >
              <Image src="/icons/close-icon.svg" width={30} height={30} />
            </div>
          </div>
          <div className="view-support-body" tabIndex={0}>
            <div />
            <div className="pdf-viewer">
              <Document
                  file={fileSrc}
                  renderMode="svg"
                  onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            </div>
          </div>
        </div>
      </Modal>
  );
};
