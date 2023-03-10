import {useState, useEffect, useContext} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import ImagesContext from "../common/context/ImagesContext.js";
import {getImages} from "../../../services/utilsFunctions.js";
import SmallAnnounce from "./SmallAnnounce";

function AnnouncesList({announces}) {
  const lang = useIntl().locale;
  const [state, setState] = useState({});
  const contextImages = useContext(ImagesContext);
  const abortController = new AbortController();
  useEffect(() => {
    async function fetchImages(signal) {
      const images = await getImages(announces, contextImages, lang, signal);
      if (!images.error) setState(images);
    }
    fetchImages(abortController.signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, [announces]);
  return (
    <div className="row sidebarPage">
      {announces ? (
        <div className="col-xs-12">
          {announces.map((announce, index) => {
            return (
              <SmallAnnounce
                key={index}
                announce={announce}
                images={state[announce._id]}
              />
            );
          })}
        </div>
      ) : (
        <h2>
          <FormattedMessage id="src.components.annoncesPage.annonces.AnnouncesList.notFound" />
        </h2>
      )}
    </div>
  );
}

export default AnnouncesList;
