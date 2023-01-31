import {useEffect, useRef, useState} from "react";
import {useIntl} from "react-intl";
import {Popper, Paper, Card, Grow} from "@mui/material";
import CheckboxPicker from "./CheckboxPicker";
import FilterCmds from "./FilterCmds";
import PriceSlider from "./PriceSlider";
import DatePicker from "../common/datepicker/DatePicker";
import {getNStars} from "./../utils/Ratings";
import _ from "lodash";

let localFilter = {};
function FilterPopper({data, onRemoveFilter, onApplyFilter, onClose, filter}) {
  const {messages} = useIntl();
  const ref = useRef();
  const type = data.popup.intlId ? "intlId" : "other";
  let intlId, ul, keys, dataL0;
  switch (type) {
    case "intlId":
      intlId = data.popup.intlId;
      ul = data.popup.ul;
      if (intlId[0] !== "star") {
        keys = Object.keys(messages).filter((key) =>
          key.startsWith(`${intlId[0]}${intlId[2]}`)
        );
        dataL0 = keys;
        if (intlId[3]) {
          dataL0 = keys.filter((key) => key.includes(intlId[3]));
          dataL0 = dataL0.map((key) => key.replace(intlId[3], ""));
        }
      } else {
        dataL0 = [intlId[0]];
      }
      break;
    default:
  }
  const [state, setState] = useState({
    id: data.id,
    anchor: data.popup.anchor,
  });
  useEffect(() => {
    localFilter = initLocalFilter(data.id);
    setState({
      filter: initL0Filter(data.id),
      ...state,
    });
  }, []);
  function getID(key, idx) {
    // if (display_l0) return idx + 1; //provide numerical value for Note, Promo, Equestrian level, Comfort level, Physical level
    return key.slice(key.lastIndexOf(".") + 1);
  }
  function initLocalFilter(id) {
    switch (id) {
      case "dates":
        return {
          dates: {
            selection:
              Object.keys(filter.dates).length > 0
                ? filter.dates.selection
                : {},
          },
        };
      case "price":
        return {
          price: {
            priceRange:
              Object.keys(filter.price).length > 0
                ? filter.price.priceRange
                : {},
          },
        };
      default:
        const obj = {};
        obj[id] = Object.keys(filter[id]).length > 0 ? filter[id] : {};
        return obj;
    }
  }
  function initL0Filter(id) {
    //initialise l0 data in global and local filters (except dates and price case done in initLocalFilter())
    const fltr = _.cloneDeep(filter); //Deep copy
    switch (id) {
      case "dates": //DateRAngePicker
        if (Object.keys(fltr[data.id]).length === 0)
          //keep existing values if any
          fltr[data.id]["selection"] = {};
        break;
      case "price": //PriceSlider
        if (Object.keys(fltr[data.id]).length === 0)
          //keep existing values if any
          fltr[data.id]["priceRange"] = {};
        break;
      default:
        //CheckBoxPicker
        if (Object.keys(fltr[data.id]).length === 0) {
          //keep existing values if any
          dataL0.forEach((id) => {
            fltr[data.id][getID(id)] = {};
            localFilter[getID(data.id)][getID(id)] = {};
          });
        }
    }
    return fltr;
  }
  useEffect(() => {
    const checkClickedOutside = (e) => {
      if (!ref.current.contains(e.target)) {
        if (e.target.outerHTML.includes("rc-slider")) return;
        if (e.target.id === state.id) return; //case where click out event is on the same button that initially opened the popper
        onClose("filter", state.id, null, "close"); //close popper without changing the crit value nor the global filter
      }
    };
    document.addEventListener("mousedown", checkClickedOutside);
    return () => {
      // unsubscribe event listener > return is triggered when component has unmounted
      document.removeEventListener("mousedown", checkClickedOutside);
    };
  }, []);
  function getStarsArray(n) {
    const starsArray = [];
    for (let i = 1; i <= n; i++) {
      starsArray.push(getNStars(i));
    }
    return starsArray;
  }
  function updateLocalFilter(id, l0, l1) {
    localFilter[id][l0] = {...l1};
  }
  return (
    Object.keys(state).length === 3 && (
      <Popper
        open={state.anchor ? true : false}
        anchorEl={state.anchor}
        ref={ref}
        transition
        disablePortal
        style={{zIndex: 100}}
      >
        {({TransitionProps, placement}) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <div style={{border: "15px", borderColor: "blue"}}>
              <Paper id="menu-list-grow">
                <Card className="row" elevation={0}>
                  {ul &&
                    ul.map(([start, end]) => {
                      return (
                        <ul key={start} className="list-unstyled m-4 ">
                          {dataL0.slice(start, end).map((l0) => {
                            let dataL1 =
                              l0 !== "star"
                                ? Object.keys(messages).filter((key) =>
                                    key.startsWith(`${l0}${intlId[4]}`)
                                  )
                                : getStarsArray(intlId[1]);
                            return (
                              <CheckboxPicker
                                key={l0}
                                l={state.id}
                                l0={l0}
                                display_l0={ul.length > 1 ? true : false}
                                intlId={intlId}
                                dataL1={dataL1}
                                filter={state.filter}
                                onHandleL1Change={(l0, l1) => {
                                  updateLocalFilter(state.id, l0, l1);
                                }}
                                getID={getID}
                              ></CheckboxPicker>
                            );
                          })}
                        </ul>
                      );
                    })}
                  {data.popup.dates && (
                    <DatePicker
                      l={getID(state.id)}
                      filter={state.filter}
                      onHandleChange={(ranges) => {
                        updateLocalFilter(state.id, "selection", ranges);
                      }}
                    ></DatePicker>
                  )}
                  {data.popup.price && (
                    <PriceSlider
                      l={getID(state.id)}
                      filter={state.filter}
                      onHandleChange={(range) => {
                        updateLocalFilter(state.id, "priceRange", {
                          0: range[0],
                          1: range[1],
                        });
                      }}
                    ></PriceSlider>
                  )}
                </Card>
              </Paper>
              <FilterCmds
                onRemoveFilter={() => {
                  onRemoveFilter(localFilter);
                }}
                onApplyFilter={() => {
                  onApplyFilter(localFilter);
                }}
              ></FilterCmds>
            </div>
          </Grow>
        )}
      </Popper>
    )
  );
}

export default FilterPopper;
