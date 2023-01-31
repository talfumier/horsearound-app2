import {PdfViewer} from "./PdfViewer.jsx";
import "./styles.css";

function ViewerPage({data, prt}) {
  return (
    <>
      {prt && (
        <div
          style={{
            position: "fixed",
            top: "40px",
            fontSize: "3rem",
            fontWeight: "bolder",
            marginLeft: "85%",
            backgroundColor: "transparent",
            color: "#7aa095",
            cursor: "pointer",
          }}
          onClick={() => {
            window.print();
          }}
        >
          &#128438;
        </div>
      )}
      <Base64Viewer data={data}></Base64Viewer>
    </>
  );
}
function Base64Viewer({data}) {
  switch (data.slice(0, data.indexOf("base64") - 1).slice(-3)) {
    case "pdf":
      return <PdfViewer data={data}></PdfViewer>;
    case "jpeg":
    case "peg": //jpeg
    case "png":
      return <img style={{paddingTop: 15, width: "100%"}} src={data}></img>;
  }
}

export default ViewerPage;
