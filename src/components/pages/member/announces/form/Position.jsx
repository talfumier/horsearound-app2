import {useState, useEffect} from "react";
import SimpleText from "./SimpleText.jsx";

let modified = null;
function Position({reset, dataIn, valid, onHandleGlobals}) {
  const {name, data} = dataIn;
  const [position, setPosition] = useState(null);
  useEffect(() => {
    setPosition([
      {name: "lat", data: {default: data.default.lat, saved: data.saved.lat}},
      {name: "lng", data: {default: data.default.lng, saved: data.saved.lng}},
    ]);
    modified = {lat: data.saved.lat, lng: data.saved.lng};
  }, [data]);
  function handleGlobals(cs, val) {
    if (cs === "value") modified = {...modified, [val[0]]: val[1]};
    onHandleGlobals(
      cs,
      cs === "valid"
        ? ["position", {...valid, [val[0]]: val[1]}]
        : ["position", modified]
    );
  }
  return (
    position !== null && (
      <>
        {position.map((pos, idx) => {
          return (
            <SimpleText
              id={true}
              key={idx}
              reset={reset}
              dataIn={pos}
              required={true}
              valid={valid}
              col="1"
              onHandleGlobals={handleGlobals}
            ></SimpleText>
          );
        })}
      </>
    )
  );
}

export default Position;
