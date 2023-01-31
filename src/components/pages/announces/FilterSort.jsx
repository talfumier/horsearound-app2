import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import buttons_data from "./buttons_data.json";
import Button from "./Button";
import FilterPopper from "./FilterPopper";
import {getNStars} from "./../utils/Ratings";
import _ from "lodash";
import "../../../css/textarea.css";
import SearchInput from "../common/SearchInput";
import {getFormattedDate} from "../utils/utilityFunctions";

let filter = {};
function FilterSort({onFilter, onSort, presetFilter}) {
  const intl = useIntl();
  const navigate = useNavigate();
  const [state, setState] = useState({});
  useEffect(() => {
    const btnsData = getButtonsData("filter");
    filter = {search: {}, ...btnsData[1]};
    setState({
      buttons_data: {
        filter: btnsData[0],
        sort: getButtonsData("sort")[0],
        sort_order: getButtonsData("sort_order")[0],
      },
    });
    setTextArea(getText(btnsData[0]));
  }, [presetFilter]);
  const [textarea, setTextArea] = useState(null);
  const [cookies, setCookie] = useCookies(["filter"]);
  function getPopup(popup) {
    if (popup.dates) return {dates: popup.dates, anchor: null};
    if (popup.intlId) return {intlId: popup.intlId, ul: popup.ul, anchor: null};
    if (popup.price) return {price: popup.price, anchor: null};
    if (popup.star) return {star: popup.star, anchor: null};
    return {};
  }
  const active = (type, btn) => {
    if (cookies.filter && cookies.filter.sort) {
      if (type === "sort" && cookies.filter.sort === btn.id) return true;
      if (type === "sort_order" && cookies.filter.order === btn.id) return true;
    } else
      return btn.id.endsWith("_DESC") || btn.id.includes("Avis") ? true : false;
  };
  function getButtonsData(type) {
    const data = [],
      fltr = {};
    buttons_data[type].map((btn) => {
      //buttons_data from buttons_data.json
      data.push({
        id: btn.id,
        label: btn.label,
        popup: type === "filter" && btn.popup ? getPopup(btn.popup) : {},
        active: active(type, btn),
        /* active:
          btn.id.endsWith("_DESC") || btn.id.includes("Avis") ? true : false, */
        crit:
          presetFilter && Object.keys(presetFilter).includes(btn.id)
            ? true
            : false,
      });
      if (type === "filter")
        fltr[btn.id] =
          presetFilter && Object.keys(presetFilter).includes(btn.id)
            ? presetFilter[btn.id]
            : {}; //global filter initialisation
    });
    return [data, fltr];
  }
  function getCritStatus(id) {
    //get crit status from global Filter
    const keys = Object.keys(filter[id]),
      n = keys.length;
    let kyes = [],
      m = 0;
    for (let i = 0; i < n; i++) {
      kyes = Object.keys(filter[id][keys[i]]);
      m = kyes.length;
      for (let j = 0; j < m; j++) {
        if (filter[id][keys[i]][kyes[j]]) {
          return true;
        }
      }
    }
    return false;
  }
  function handleButtonClick(type, id, e, status) {
    const btns_data = {...state.buttons_data};
    const btns_data_type = [...btns_data[type]];
    let btn = null,
      cs = 0;
    const n = btns_data_type.length;
    for (let i = 0; i < n; i++) {
      if (btns_data_type[i].id === id) {
        btn = btns_data_type[i].active; //initial value
        btns_data_type[i].active = !btns_data_type[i].active;
        if (status && status === "crit") {
          btns_data_type[i].crit =
            type === "filter" ? getCritStatus(id) : false;
        }
        if (!btn) {
          //button has become activated cs=0 > cs=1
          cs = 1;
        } else {
          //button has become deactivated cs=1 > cs=0
          cs = 0;
        }
        if (e) {
          btns_data_type[i].popup.anchor = cs === 1 ? e.currentTarget : null;
        } else {
          //remove filter case
          btns_data_type[i].popup.anchor = null;
          btns_data_type[i].active = false;
        }
      } else {
        //close all other filter pop-ups if any
        btns_data_type[i].active = false;
        btns_data_type[i].popup.anchor = null;
      }
    }
    btns_data[type] = btns_data_type;
    setState({
      buttons_data: btns_data,
      ...state,
    });
  }
  function handleSort(sort, order) {
    let i;
    for (i = 0; i < 6; i++) {
      if (sort[i].active) break;
    }
    navigate("/announces", {replace: true}); //removes query parameters in the URL (coming from home page) once sort criterion has changed
    const filter = cookies.filter ? cookies.filter : {};
    filter.sort = sort[i].id;
    filter.order = order[0].active ? "sort_DESC" : "sort_ASC";
    setCookie("filter", filter, {path: "/"});
    onSort(sort[i].id, order[0].active ? "desc" : "asc");
  }
  function handleOnFilter() {
    function trimFilter() {
      //put filter in the same format as presetFilter
      const fltr = _.cloneDeep(filter);
      Object.keys(fltr).map((key) => {
        if (Object.keys(fltr[key]).length === 0) delete fltr[key];
      });
      return fltr;
    }
    navigate("/announces", {replace: true}); //removes query parameters in the URL (coming from home page) once a filter criterion is changed
    setCookie("filter", {filter: trimFilter(), page: 1}, {path: "/"});
    onFilter(filter);
  }
  function handleRemoveFilter(localFilter) {
    //remove local filter from global filter
    const id = Object.keys(localFilter)[0];
    filter[id] = {};
    //set crit to false
    handleButtonClick("filter", id, null, "crit");
    handleOnFilter();
    setTextArea(getText(state.buttons_data.filter));
  }
  function handleReset() {
    Object.keys(filter).map((id) => {
      filter[id] = {};
      handleButtonClick("filter", id, null, "crit");
    });
    document.getElementById("clearAll").click();
    handleOnFilter();
  }
  function getText(btns_data) {
    function getLabel(id) {
      const n = Object.keys(btns_data).length;
      for (let i = 0; i < n; i++) {
        if (btns_data[i].id === id) {
          return [
            intl.formatMessage({
              id: btns_data[i].label,
            }),
            i,
          ];
        }
      }
    }
    let cs = 0,
      c = 0,
      sgl_l0 = 0, //single l0 flag > promo, comfortLevel...
      text = [],
      label = [],
      intlId = [],
      txt = "",
      txts = [];
    Object.keys(filter).forEach((id) => {
      if (Object.keys(filter[id]).length > 0) {
        cs = 1;
        sgl_l0 = 0;
        label = getLabel(id);
        switch (id) {
          case "search":
            txts = [];
            c = 0;
            Object.keys(filter[id].tags).map((l1, idx) => {
              if (filter[id].tags[idx]) {
                txts.push(filter[id].tags[idx].text);
                c = 1;
              }
            });
            if (c === 1) {
              txts = txts.join(", ");
              text.push(
                <>
                  <strong>
                    <span
                      style={{color: "red", fontSize: "16px"}}
                    >{`${intl.formatMessage({
                      id: "src.components.annoncesPage.searchbar.searchTextArea",
                    })} >> `}</span>
                  </strong>
                  <span style={{color: "blue"}}>{txts}</span>
                </>
              );
            }
            break;
          case "dates":
          case "price":
            text.push(
              <>
                <strong>
                  <span
                    style={{color: "red", fontSize: "16px"}}
                  >{`${label[0]} >> `}</span>
                </strong>
                <span style={{color: "red"}}>
                  {intl.formatMessage({
                    id: "src.components.bookingPage.BookDetailInfo.from",
                  })}
                </span>
                <span style={{color: "blue"}}>
                  {id === "dates"
                    ? `${getFormattedDate(filter[id].selection.startDate)} `
                    : `${filter[id].priceRange["0"]} `}
                </span>
                <span style={{color: "red"}}>
                  {intl.formatMessage({
                    id: "src.components.bookingPage.BookDetailInfo.to",
                  })}
                </span>
                <span style={{color: "blue"}}>
                  {id === "dates"
                    ? `${getFormattedDate(filter[id].selection.endDate)}`
                    : `${filter[id].priceRange["1"]} €`}
                </span>
              </>
            );
            break;
          case "note":
            txts = [];
            Object.keys(filter[id]).map((l0) => {
              c = 0;
              txt = "";
              Object.keys(filter[id][l0]).map((l1, idx) => {
                if (filter[id][l0][l1]) {
                  txts.push(<span key={idx}>{getNStars(idx + 1)}</span>);
                  txts.push(
                    <span
                      key={idx + 100}
                      style={{color: "blue", fontSize: "25px"}}
                    >
                      {" "}
                      ,{" "}
                    </span>
                  );
                  c = 1;
                }
              });
            });
            if (c === 1) {
              txts = txts.slice(0, -1);
              text.push(
                <>
                  <strong>
                    <span
                      style={{color: "red", fontSize: "16px"}}
                    >{`${label[0]} >> `}</span>
                  </strong>
                  <span>
                    {txts.map((txt) => {
                      return txt;
                    })}
                  </span>
                </>
              );
            }
            break;
          case "promo":
          case "physicalLevel":
          case "equestrianLevel":
          case "comfortLevel":
            sgl_l0 = 1;
          case "destinations":
          case "activities":
          case "divers":
            txts = [];
            intlId = btns_data[label[1]].popup.intlId;
            let i = 0;
            Object.keys(filter[id]).map((l0) => {
              c = 0;
              txt = "";
              Object.keys(filter[id][l0]).map((l1) => {
                if (filter[id][l0][l1]) {
                  txt = `${txt}${intl.formatMessage({
                    id: intlId[0] + intlId[2] + "." + l0 + intlId[4] + "." + l1,
                  })}, `;
                  c = 1;
                }
              });
              if (c === 1) {
                txts.push([
                  `${
                    sgl_l0 === 0
                      ? intl.formatMessage({
                          id: intlId[0] + intlId[2] + "." + l0 + intlId[3],
                        })
                      : ""
                  }`,
                  `${sgl_l0 === 0 ? " (" : ""}${txt.substring(
                    0,
                    txt.length - 2
                  )}${sgl_l0 === 0 ? ")" : ""}, `,
                ]);
                i++;
              }
            });
            txts[i - 1][1] = txts[i - 1][1].substring(
              0,
              txts[i - 1][1].length - 2
            );
            text.push(
              <>
                <strong>
                  <span
                    style={{color: "red", fontSize: "16px"}}
                  >{`${label[0]} >> `}</span>
                </strong>
                {txts.map((item, idx) => {
                  return (
                    <span key={idx} style={{color: "blue"}}>
                      <strong>{item[0]}</strong>
                      <span>{item[1]}</span>
                    </span>
                  );
                })}
              </>
            );
            break;
        }
      }
    });
    if (cs === 0)
      return (
        <FormattedMessage id="src.components.annoncesPage.searchbar.textarea"></FormattedMessage>
      );
    return (
      <div>
        {text.map((txt, idx) => {
          return <ul key={idx}>{txt}</ul>;
        })}
      </div>
    );
  }
  function isFilterEmpty(obj) {
    let bl = true;
    recursive(obj);
    function recursive(obj) {
      Object.values(obj).map((val) => {
        if (val === true || typeof val === "number" || _.isDate(val))
          bl = false;
        else if (val && typeof val === "object") recursive(val);
      });
    }
    return bl;
  }
  function handleApplyFilter(localFilter) {
    if (isFilterEmpty(localFilter)) {
      //applying an empty filter is equivalent to removing the filter
      handleRemoveFilter(localFilter);
      return;
    }
    //commit local filter to the global filter
    const local = _.cloneDeep(localFilter);
    const id = Object.keys(localFilter)[0];
    const l0_keys = Object.keys(localFilter[id]);
    l0_keys.forEach((key) => {
      filter[id][key] = local[id][key];
    });
    handleButtonClick("filter", id, null, "crit");
    handleOnFilter();
    setTextArea(getText(state.buttons_data.filter));
  }
  function handleSearch(tags) {
    tags.length === 0 ? (filter.search = {}) : (filter.search.tags = tags);
    handleOnFilter();
    setTextArea(getText(state.buttons_data.filter));
  }
  function getPopperData() {
    const data = state.buttons_data.filter;
    const n = data.length;
    for (let i = 0; i < n; i++) {
      if (!data[i].popup) continue;
      if (data[i].popup.anchor) {
        return {
          id: data[i].id,
          popup: data[i].popup,
        };
      }
    }
  }
  function getStyle(active, crit) {
    let style = {
      borderWidth: 2,
      borderRadius: 5,
      lineHeight: "normal",
      outline: 0,
    };
    if (active && crit)
      style = {
        ...style,
        backgroundColor: "#7ca494",
        borderColor: "orange",
        color: "white",
      };
    if (!active && !crit)
      style = {
        ...style,
        backgroundColor: "#E7E6E6",
        borderColor: "#D0CECE",
        color: "",
      };
    if (active && !crit)
      style = {
        ...style,
        backgroundColor: "#7ca494",
        borderColor: "yellow",
        color: "white",
      };
    if (!active && crit)
      style = {
        ...style,
        backgroundColor: "#7ca494",
        borderColor: "yellow",
        color: "white",
      };
    return style;
  }
  const tags = () => {
    try {
      return cookies.filter.filter.search.tags;
    } catch (error) {
      return [];
    }
  };
  const popperData = state.buttons_data && getPopperData();
  return (
    Object.keys(state).length === 1 && (
      <div>
        <div
          id="zone1"
          className="w-100 d-md-block d-lg-block d-xl-block"
          style={{marginLeft: 0}}
        >
          <div className="row ml-1">
            {/* SEARCH INPUT FIELD */}
            <div className="col-7-md mt-2 mb-0 p-0">
              <div className="form-group form-inline m-0">
                <label className="ml-2" htmlFor="searchText">
                  <FormattedMessage id="src.components.annoncesPage.searchbar.search" />
                </label>
                <SearchInput
                  tags={tags()}
                  onHandleChange={handleSearch}
                ></SearchInput>
              </div>
              {/* FILTER BUTTONS */}
              <div className="form-group form-inline m-0">
                <label className="ml-2">
                  <FormattedMessage id="src.components.annoncesPage.searchbar.filter" />
                  {" :"}
                </label>
                <div className="btn-group dropdownSearch">
                  {state.buttons_data["filter"].map((btn) => {
                    return (
                      <Button
                        key={btn.id}
                        id={btn.id}
                        type="filter"
                        label={btn.label}
                        style={getStyle(btn.active, btn.crit)}
                        onHandleClick={handleButtonClick}
                      ></Button>
                    );
                  })}
                </div>
              </div>
              <div className="row">
                {/* SORT BUTTONS */}
                <div className="col">
                  <label className="ml-2">
                    <FormattedMessage id="src.components.annoncesPage.searchbar.sort" />
                    {" :"}
                  </label>
                  <div className="btn-group dropdownSearch">
                    {state.buttons_data["sort"].map((btn) => {
                      return (
                        <Button
                          key={btn.id}
                          id={btn.id}
                          type="sort"
                          label={btn.label}
                          style={getStyle(btn.active, btn.crit)}
                          onHandleClick={(type, id, e) => {
                            handleButtonClick(type, id, e);
                            handleSort(
                              state.buttons_data.sort,
                              state.buttons_data.sort_order
                            );
                          }}
                        ></Button>
                      );
                    })}
                  </div>
                  {/* SORT BY ORDER BUTTONS */}
                  <label className="ml-2">
                    <FormattedMessage id="src.components.annoncesPage.searchbar.orderSort" />
                    {" :"}
                  </label>
                  <div className="btn-group dropdownSearch">
                    {state.buttons_data["sort_order"].map((btn) => {
                      return (
                        <Button
                          key={btn.id}
                          id={btn.id}
                          type="sort_order"
                          label={btn.label}
                          style={getStyle(btn.active, btn.crit)}
                          onHandleClick={(type, id, e) => {
                            handleButtonClick(type, id, e);
                            handleSort(
                              state.buttons_data.sort,
                              state.buttons_data.sort_order
                            );
                          }}
                        ></Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="col ml-4 mt-2 mb-0">
              <div className="row align-items-center ">
                <div
                  className="textarea"
                  style={{color: "grey", fontSize: "16px"}}
                >
                  {textarea}
                </div>
                <button
                  className="btn btn-success mx-3"
                  id="filterReset"
                  type="reset"
                >
                  <FormattedMessage id="src.components.annoncesPage.searchbar.reset"></FormattedMessage>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* FILTER CRITERIA POP-UP */}
        {popperData && popperData.popup.anchor && (
          <FilterPopper
            data={popperData}
            filter={_.cloneDeep(filter)}
            onClose={handleButtonClick}
            onRemoveFilter={handleRemoveFilter}
            onApplyFilter={handleApplyFilter}
          ></FilterPopper>
        )}
      </div>
    )
  );
}

export default FilterSort;
