import {useState, useEffect} from "react";
import {useIntl} from "react-intl";
import SimpleText from "../announces/form/SimpleText.jsx";

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
  useEffect(() => {
    setState(dataIn);
  }, [reset, dataIn]);
  const wd = {
    bankCode: [230, 220],
    guichetCode: [140, 130],
    numberAccount: [230, 220],
    keyAccount: [110, 100],
    deviseAccount: [100, 90],
    domiciliation: [270, 260],
  };
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
                    <SimpleText
                      reset={reset}
                      dataIn={state[key]}
                      required={true}
                      valid={valid[key]}
                      onHandleGlobals={onHandleGlobals}
                      label={false}
                      w={wd[key][1]}
                    ></SimpleText>
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
