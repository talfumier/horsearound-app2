import {useState, useEffect} from "react";
import {useIntl} from "react-intl";
import SimpleText from "../announces/form/SimpleText.jsx";
import {isEven} from "../../utils/utilityFunctions.js";

function Rib({reset, dataIn, valid, onHandleGlobals}) {
  const {formatMessage} = useIntl();
  const keys = [
    "bankCode",
    "guichetCode",
    "numberAccount",
    "keyAccount",
    "deviseAccount",
    "domiciliation",
  ];
  const [state, setState] = useState({});
  const [cur, setCurrency] = useState("");
  useEffect(() => {
    setState(dataIn);
    setCurrency(dataIn.deviseAccount.data[isEven(reset) ? "default" : "saved"]);
  }, [reset, dataIn]);
  const wd = {
    bankCode: [230, 220],
    guichetCode: [140, 130],
    numberAccount: [230, 220],
    keyAccount: [110, 100],
    deviseAccount: [100, 90],
    domiciliation: [270, 260],
  };
  function handleChange(e) {
    setCurrency(e.target.value);
    onHandleGlobals("value", [e.target.id, e.target.value]);
  }
  return (
    Object.keys(state).length > 0 && (
      <div className="container">
        <table>
          <thead>
            <tr>
              {keys.map((key) => {
                return (
                  <th key={key}>
                    <h5
                      style={{
                        textAlign: "center",
                        width: wd[key][0],
                        paddingLeft: "20px",
                      }}
                    >
                      {formatMessage({
                        id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${key}`,
                      })}
                    </h5>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              {keys.map((key) => {
                return (
                  <td
                    key={key}
                    style={{
                      maxWidth: wd[key][0],
                      verticalAlign: "top",
                    }}
                  >
                    {key !== "deviseAccount" ? (
                      <SimpleText
                        reset={reset}
                        dataIn={state[key]}
                        required={true}
                        valid={valid[key]}
                        onHandleGlobals={onHandleGlobals}
                        label={false}
                        w={wd[key][1]}
                      ></SimpleText>
                    ) : (
                      <select
                        id="deviseAccount"
                        className="ml-4 pl-4 mr-0 mt-2 "
                        style={{
                          cursor: "pointer",
                          border: "solid 1px",
                          borderColor: "green",
                          height: "35px",
                          width: "90px",
                          borderRadius: "5px",
                        }}
                        onChange={handleChange}
                        value={cur}
                      >
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>USD</option>
                      </select>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    )
  );
}

export default Rib;
