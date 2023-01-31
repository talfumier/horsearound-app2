import {useState, useEffect} from "react";
import _ from "lodash";
import {CalendarRangePro} from "../../../common/datepicker/CalendarRange.jsx";
import DatesTable from "./DatesTable.jsx";
import colors from "../../../common/datepicker/colors.json";
import {getNRandomColors} from "../../../utils/utilityFunctions.js";

function CalendarBlock({
  type,
  duration,
  reset,
  data,
  disabled,
  onHandleColor,
  onHandleGlobals,
}) {
  data = _.orderBy(data, ["dateStart"], ["asc"]);
  const rangeColors = getRangeColors(data.length);
  data.map((date, idx) => {
    data[idx].color = rangeColors[idx];
  });
  const [ranges, setRanges] = useState(data);
  const [del, setDelete] = useState(null);
  useEffect(() => {
    setRanges(data);
    handleColor(data.length);
  }, [reset]);
  function getRangeColors(len) {
    if (len <= 10) return colors;
    else return colors.concat(getNRandomColors(len - 10));
  }
  function handleSelection(cs, sel) {
    let dts = [...ranges];
    switch (cs) {
      case "new": //add range in CalendarRangePro and DatesTable component
        dts = _.sortBy(
          [...dts, sel],
          [
            function (o) {
              return o.period.dateStart.setHours(0, 0, 0, 0);
            },
          ]
        );
        break;
      case "del":
        setDelete(sel); //delete range in CalendarRangePro component
        _.remove(dts, (dt) => {
          //delete range in DatesTable component
          return (
            dt.period.dateStart.setHours(0, 0, 0, 0) ===
              sel.startDate.setHours(0, 0, 0, 0) &&
            dt.period.dateEnd.setHours(0, 0, 0, 0) ===
              sel.endDate.setHours(0, 0, 0, 0)
          );
        });
    }
    setRanges(dts);
    onHandleGlobals("valid", ["dates", dts.length > 0 ? true : false]);
    onHandleGlobals("value", [
      "dates", //removes color property
      dts.map(({color, ...rest}) => {
        return rest;
      }),
    ]);
    handleColor(dts.length);
  }
  function handleColor(len) {
    onHandleColor({dates: len > 0});
  }
  return (
    <div className="d-flex justify-content-center w-70">
      <CalendarRangePro
        type={type}
        dates={ranges}
        duration={
          type === "Fixed_Fixed" || type === "Flex_Fixed"
            ? parseInt(duration.nbDays)
            : null
        }
        del={del}
        disabled={disabled}
        onHandleNewSelection={(sel) => {
          handleSelection("new", {...sel, duration}); //duration data from AnnounceForm in edit or create mode
        }}
      ></CalendarRangePro>
      <DatesTable
        type={type}
        data={ranges}
        onHandleDelete={(sel) => {
          handleSelection("del", sel);
        }}
        onHandleGlobals={onHandleGlobals}
      ></DatesTable>
    </div>
  );
}

export default CalendarBlock;
