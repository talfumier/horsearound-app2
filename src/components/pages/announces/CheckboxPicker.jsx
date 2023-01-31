import {useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import _ from "lodash";

function CheckboxPicker({
  l,
  l0,
  display_l0,
  intlId,
  dataL1,
  onHandleL1Change,
  filter,
  getID,
}) {
  const l1_keys = getL1Keys();
  const [state, setState] = useState({});
  function initL1Filter() {
    //initialise l1 data in global filter
    const fltr = _.cloneDeep(filter); //Deep copy
    const obj = {};
    if (Object.keys(fltr[l][getID(l0)]).length === 0) {
      dataL1.forEach((id) => {
        obj[getID(id)] = false;
      });
      const temp = {...fltr[l]}; //keep filter unchanged in case of existing data
      temp[getID(l0)] = obj;
      fltr[l] = temp;
    }
    return fltr;
  }
  useEffect(() => {
    const fltr = initL1Filter();
    setState({l1: getL1(fltr), filter: fltr});
  }, []);
  function getL1Keys() {
    const keys = [];
    dataL1.map((key, idx) => {
      return keys.push(getID(key, idx));
    });
    return keys;
  }
  function getL1(fltr) {
    let l1 = {};
    l1_keys.map((id) => {
      return (l1[id] = fltr ? fltr[l][getID(l0)][id] : false); //take global filter status if any
    });
    return l1;
  }
  function getL0status() {
    const {l1} = state;
    let i = 0,
      n = l1_keys.length;
    l1_keys.forEach((key) => {
      if (l1[key]) ++i;
    });
    if (i === n) return true;
    return false;
  }
  function handleL0Change(checked) {
    l1_keys.forEach((key) => {
      handleL1Change(key, checked);
    });
  }
  function handleL1Change(key, checked) {
    const {l1} = state;
    l1[key] = checked;
    setState({l1, ...state});
    onHandleL1Change(getID(l0), l1);
  }
  return (
    Object.keys(state).length === 2 && (
      <ul key={l0} className="form-check ">
        <li key={l0}>
          <input
            key={l0}
            id={l0}
            className="form-check-input"
            type="checkbox"
            checked={getL0status()}
            onChange={(e) => {
              handleL0Change(e.currentTarget.checked);
            }}
          />
          <label
            key={`${l0}x`}
            className="form-check-label"
            htmlFor={l0}
            style={{marginLeft: 20}}
          >
            {l0 !== "star" && display_l0 && (
              <FormattedMessage id={`${l0}${intlId[3]}`} />
            )}
          </label>
          <ul className="ml-4" key={`${l0}y`}>
            {dataL1.map((key, idx) => {
              return (
                <li key={key}>
                  <input
                    key={key}
                    id={key}
                    className="form-check-input"
                    type="checkbox"
                    checked={state.l1[l1_keys[idx]]}
                    onChange={(e) => {
                      handleL1Change(
                        getID(e.currentTarget.id),
                        e.currentTarget.checked
                      );
                    }}
                  ></input>
                  <label
                    key={`${idx}x`}
                    className="form-check-label font-weight-normal"
                    htmlFor={key}
                    style={{marginLeft: 20}}
                  >
                    {l0 !== "star" && <FormattedMessage id={key} />}
                    {l0 === "star" && key}
                  </label>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    )
  );
}

export default CheckboxPicker;
