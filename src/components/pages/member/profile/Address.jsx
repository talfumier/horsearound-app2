import {useState, useEffect} from "react";
import SimpleText from "../announces/form/SimpleText.jsx";

let modified = null;
function Address({reset, dataIn, valid, wl, onHandleGlobals}) {
  const {name, data} = dataIn;
  const [address, setAddress] = useState(null);
  useEffect(() => {
    function prepareData() {
      const obj = [];
      ["address", "postcode", "city", "country"].map((key) => {
        obj.push({
          name: key,
          data: {
            default: data.default[key],
            saved:
              typeof data.saved[key] !== "undefined" ? data.saved[key] : "",
          },
        });
      });
      return obj;
    }
    setAddress(prepareData());
    modified = {
      address: data.saved.address,
      postcode: data.saved.postcode,
      city: data.saved.city,
      country: data.saved.country,
    };
  }, [data]);
  function handleGlobals(cs, val) {
    if (cs === "value") modified[val[0]] = val[1];
    onHandleGlobals(
      cs,
      cs === "valid"
        ? ["address", {...valid, [val[0]]: val[1]}]
        : ["address", modified]
    );
  }
  return (
    address !== null && (
      <>
        {address.map((item, idx) => {
          return (
            <SimpleText
              key={idx}
              type={item.name === "address" ? "textarea" : "text"}
              reset={reset}
              dataIn={item}
              required={true}
              w={`${item.name === "postcode" ? "70%" : null}`}
              wl={wl[item.name]}
              valid={valid[item.name]}
              onHandleGlobals={handleGlobals}
            ></SimpleText>
          );
        })}
      </>
    )
  );
}

export default Address;
