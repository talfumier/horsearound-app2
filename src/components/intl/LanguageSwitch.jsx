import {useContext} from "react";
import IntlContext from "./IntlContext";
import france from "./flags/france.png";
import uk from "./flags/uk.png";

function LanguageSwitch({noLink, images}) {
  //noLink is used with LoadingPage (dummy home page)
  const functions = useContext(IntlContext);
  return (
    <div className="d-flex flex-row justify-content-center mt-5 pt-2 mx-auto mb-2">
      <button
        className="btn btn-link p-2 ml-3"
        onClick={
          noLink
            ? null
            : () => {
                functions.switchToFrench(images);
              }
        }
      >
        <img src={france} style={{height: "15px"}} alt="frenchFlag" />
      </button>
      <button
        className="btn btn-link p-2 ml-1"
        onClick={
          noLink
            ? null
            : () => {
                functions.switchToEnglish(images);
              }
        }
      >
        <img src={uk} style={{height: "15px"}} alt="UKFlag" />
      </button>
    </div>
  );
}

export default LanguageSwitch;
