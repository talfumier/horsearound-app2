import {useState, useEffect} from "react";
import {Row} from "react-bootstrap";
import {useIntl} from "react-intl";
import {toDate} from "date-fns";
import SimpleText from "./SimpleText.jsx";
import "./upload.css";
import {getEmptyImage} from "./Images.jsx";
import {getFormattedDate} from "../../../utils/utilityFunctions.js";

function ImageUnit({dataIn, onHandleMain, onHandleGlobals}) {
  const {formatMessage} = useIntl();
  const [value, setValue] = useState(getEmptyImage(dataIn.image));
  const keys = Object.keys(dataIn);
  useEffect(() => {
    setValue(dataIn);
    setTimeout(() => {
      try {
        document.getElementById(`sliderMainImage${dataIn.image}`).checked =
          dataIn.main;
      } catch (error) {}
    }, 500);
  }, [dataIn]);
  function handleClear(image) {
    document.getElementById(`selectFile${image}`).value = ""; //reset file selector
    const val = getEmptyImage(image);
    setValue(val);
    onHandleGlobals("value", val, image);
  }
  function handleGlobals(cs, val, image) {
    if (cs === "valid") return; //no validation at all since it is optional
    onHandleGlobals("value", val, image);
  }
  function fileSize(size) {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size >= 1024 && size < 1048576) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else if (size >= 1048576) {
      return `${(size / 1048576).toFixed(1)} MB`;
    }
  }
  function handleSelectedFile(e, image) {
    const file = e.target.files[0];
    let val = null;
    if (typeof file === "undefined") {
      val = getEmptyImage(image);
      setValue(val);
      handleGlobals("value", val, image);
    } else {
      const reader = new FileReader();
      reader.onload = function () {
        val = {
          image,
          name: file.name,
          main: false,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          data: reader.result,
        };
        setValue(val);
        handleGlobals("value", val, image);
      };
      reader.readAsDataURL(file);
    }
  }
  function displayData(key, val) {
    switch (key) {
      case "size":
        return fileSize(val);
      case "lastModified":
        if (val === 0) return "";
        else return getFormattedDate(toDate(val));
      default:
        return val;
    }
  }
  return (
    <>
      <div className="d-flex justify-content-between ">
        <button type="button" className="dropdown singleDrop btn btn-success">
          {formatMessage({
            id: "src.components.announcePage.announceDetailTab.program.image",
          })}
          <span className="badge badge-light mx-2">{value.image}</span>
          <i
            className="fa fa-trash fa-lg ml-4"
            onClick={() => {
              handleClear(value.image);
            }}
          ></i>
        </button>
        <button
          className="dropdown singleDrop btn btn-success"
          onClick={() => {
            document.getElementById(`selectFile${value.image}`).click();
          }}
        >
          {formatMessage({
            id: "src.components.announcePage.announceDetailTab.program.chooseFile",
          })}
          <i className="fa fa-upload fa-lg ml-4"> </i>
          <input
            id={`selectFile${value.image}`}
            className="upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleSelectedFile(e, value.image);
            }}
          />
        </button>
      </div>
      {keys.map((key, idx) => {
        if (key !== "image" && key !== "data")
          return (
            <Row key={idx} className="d-flex justify-content-left my-2 mx-2">
              {key !== "main" && (
                <SimpleText
                  key={idx}
                  dataIn={{
                    name: key,
                    data: displayData(key, value[key]),
                  }}
                  required={false}
                  label={false}
                  disabled={true}
                  trash={false}
                  w="300px"
                  valid={{[key]: true}}
                  onHandleGlobals={(cs, val) => {
                    handleGlobals(cs, val, value.image);
                  }}
                ></SimpleText>
              )}
              {key === "main" && (
                <label className="switch ml-4 mt-4">
                  <input
                    id={`sliderMainImage${value.image}`}
                    type="checkbox"
                    value={value.main}
                    disabled={value.data.length === 0}
                    onChange={(e) => {
                      onHandleMain(e.target.checked, value.image);
                    }}
                  />
                  <span className="slider round "></span>
                </label>
              )}
            </Row>
          );
      })}
      <div className="d-flex justify-content-center">
        <img src={value.data} alt="" style={{height: "200px"}} />
      </div>
    </>
  );
}

export default ImageUnit;
