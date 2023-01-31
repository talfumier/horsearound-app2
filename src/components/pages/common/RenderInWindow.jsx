import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";

export function RenderInWindow({comp, size, onClose}) {
  const [container, setContainer] = useState(null);
  const newWindow = useRef(window);
  useEffect(() => {
    const div = document.createElement("div");
    setContainer(div);
  }, []);
  useEffect(() => {
    if (container && newWindow.current) {
      newWindow.current = window.open(
        "",
        "",
        `resizable,scrollbars,width=${size.width},height=${size.height},left=${size.x},top=${size.y}`
      );
      newWindow.current.document.write(
        "<html><head></head><body></body></html>"
      );
      newWindow.current.document.head.innerHTML =
        window.document.head.innerHTML; //required to ensure styles are transfered to the new window
      newWindow.current.addEventListener("beforeunload", onClose);
      newWindow.current.document.body.appendChild(container);
      // newWindow.current.document.title = "A React portal window";
      return () => {
        newWindow.current.close();
        newWindow.current.removeEventListener("beforeunload", onClose);
      };
    }
  }, [container, newWindow]);
  function ElementToDisplay() {
    return (
      <div style={{width: "100%"}}>
        <div
          id="print"
          style={{
            position: "fixed",
            top: "10px",
            fontSize: "2.5rem",
            fontWeight: "bolder",
            marginLeft: "93%",
            backgroundColor: "transparent",
            color: "#7aa095",
            cursor: "pointer",
          }}
          onClick={() => {
            newWindow.current.print();
          }}
        >
          &#128438;
        </div>
        {comp}
      </div>
    );
  }
  return (
    container && createPortal(<ElementToDisplay></ElementToDisplay>, container)
  );
}
