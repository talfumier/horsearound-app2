import {useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import "./styles.css";

export function PdfViewer({data}) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [pageNumber, setPageNumber] = useState(1);
  /*  document.addEventListener("contextmenu", (event) => {
    event.preventDefault(); //prevent right click on screen
  }); */

  function onDocumentLoadSuccess({numPages}) {
    setPageNumber(1);
  }
  return (
    <>
      <div className="main">
        <Document file={data} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
    </>
  );
}
