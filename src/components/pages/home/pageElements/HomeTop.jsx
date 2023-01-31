import {useState, useEffect, useContext} from "react";
import {useIntl} from "react-intl";
import _ from "lodash";
import ImagesContext from "../../common/context/ImagesContext.js";
import {getImages} from "../../../../services/utilsFunctions.js";
import HomeTopPromo from "./HomeTopPromo";
import HomeTopDeals from "./HomeTopDeals";

function HomeTop({top3}) {
  const lang = useIntl().locale;
  const [images, setImages] = useState({});
  const abortController = new AbortController();
  const contextImages = useContext(ImagesContext);
  useEffect(() => {
    async function fetchImages(signal) {
      const imgs = await getImages(top3, contextImages, lang, signal);
      if (!imgs.error) setImages(imgs);
    }
    fetchImages(abortController.signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, [top3]);
  return (
    <div>
      <HomeTopPromo topDeal={top3[0]} images={images}></HomeTopPromo>
      <HomeTopDeals top3={top3} images={images}></HomeTopDeals>
    </div>
  );
}

export default HomeTop;
