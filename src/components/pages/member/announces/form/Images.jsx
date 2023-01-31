import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Row} from "react-bootstrap";
import _ from "lodash";
import ImageUnit from "./ImageUnit.jsx";
import {isEven} from "../../../utils/utilityFunctions.js";

export function getEmptyImage(image) {
  return {
    image,
    name: "",
    main: false,
    type: "",
    size: 0,
    lastModified: 0,
    data: "",
  };
}
function Images({reset, dataIn, onHandleGlobals}) {
  const {locale, formatMessage} = useIntl();
  const {name, data: dta} = dataIn;
  const data = isEven(reset) ? dta.default.data : dta.saved.data;
  const [images, setImages] = useState(null);
  useEffect(() => {
    setImages(data);
  }, [reset]);
  function handleMain(checked, image) {
    const imgs = [...images];
    let idx = -1,
      total = 0;
    images.map((img, i) => {
      if (img.image === image) {
        idx = i;
        imgs[i].main = checked;
      } else if (checked) {
        imgs[i].main = false;
        document.getElementById(`sliderMainImage${i + 1}`).checked = false;
      }
      total += img.size;
    });
    setImages(imgs);
    onHandleGlobals("value", [name, {data: imgs, total}]);
  }
  function handleGlobals(cs, val, image) {
    const imgs = [...images];
    let idx = -1,
      total = 0;
    imgs.map((img, i) => {
      if (img.image === image) idx = i;
      total += img.size;
    });
    if (typeof imgs[idx][val[0]] === "undefined") imgs[idx] = val;
    else imgs[idx][val[0]] = val[1];
    setImages(imgs);
    onHandleGlobals("value", [name, {data: imgs, total}]);
  }
  return (
    images &&
    images.length === 5 && (
      <>
        <Row className="justify-content-md-left mx-2 pl-2 my-4 pt-2">
          <label className="mx-0 px-0 mt-2 ">
            <h5
              style={{
                minWidth: "140px",
                color: "green",
              }}
            >
              <FormattedMessage
                id={
                  "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.images"
                }
              />
            </h5>
          </label>
          <input
            type="text"
            className="form-control px-0 mt-2 w-50"
            style={{
              textAlign: "center",
              borderRadius: "5px",
            }}
            readOnly={true}
            placeholder={formatMessage({
              id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.imagesPH",
            })}
          ></input>
        </Row>
        <div
          className="d-flex justify-content-center"
          style={{
            marginLeft: "0%",
            marginRight: "0%",
          }}
        >
          <div style={{marginTop: "2.8%"}}>
            {Object.keys(images[0]).map((name, idx) => {
              return (
                idx > 0 &&
                idx !== 6 && (
                  <Row key={idx}>
                    <label className="ml-4 pt-0 pb-0 pl-1 mr-5 ">
                      <h5
                        style={{
                          whiteSpace: "pre-wrap",
                          minWidth: "80px",
                          height: "12px",
                          color: "green",
                        }}
                      >
                        <FormattedMessage
                          id={`src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${name}`}
                        />
                      </h5>
                    </label>
                  </Row>
                )
              );
            })}
          </div>
          {images.map((image, idx) => {
            return (
              <div
                key={idx}
                className="mx-0 my-3 px-0"
                style={{
                  border: "1px solid",
                  borderColor: "green",
                  borderRadius: "5px",
                  maxWidth: "40%",
                }}
              >
                <ImageUnit
                  key={idx}
                  dataIn={image}
                  onHandleMain={handleMain}
                  onHandleGlobals={handleGlobals}
                ></ImageUnit>
              </div>
            );
          })}
        </div>
      </>
    )
  );
}

export default Images;
