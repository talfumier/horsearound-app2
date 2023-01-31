import {useState, useEffect} from "react";
import {useIntl} from "react-intl";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {DateRange} from "react-date-range";
import * as locales from "date-fns/locale";
import {differenceInCalendarDays, addDays} from "date-fns";
import _ from "lodash";
import colors from "./colors.json";
import {getNRandomColors} from "../../utils/utilityFunctions.js";
import "./dateRange.css";
//https://hypeserver.github.io/react-date-range/#definedrange

export function CalendarRangeFixed2({
  dates, //Calendar range element for datesType="Fixed_Fixed" (Fixed dates, Fixed duration)
  del,
  rangeColors,
}) {
  const lang = useIntl().locale;
  const [ranges, setRanges] = useState([]);
  const [focusedRange, setFocusedRange] = useState([0, 0]);
  useEffect(() => {
    setRanges(_.orderBy(dates, ["startDate"], ["asc"]));
  }, []);
  useEffect(() => {
    if (del !== null) {
      const rgs = [...ranges];
      const rg = _.filter(rgs, {
        startDate: del.startDate,
        endDate: del.endDate,
      })[0];
      const idx = rgs.indexOf(rg);
      rangeColors.splice(idx, 1);
      rgs.splice(idx, 1);
      setRanges(_.orderBy(rgs, ["startDate"], ["asc"]));
    }
  }, [del]);
  return (
    ranges.length >= 1 && (
      <DateRange
        locale={locales[lang]}
        weekStartsOn={1}
        ranges={ranges}
        showDateDisplay={true}
        showPreview={false}
        dragSelectionEnabled={false}
        onRangeFocusChange={(rg) => {
          setFocusedRange(rg);
          setRanges(_.orderBy(ranges, ["startDate"], ["asc"])); //necessary to reset month and year calendar
        }}
        focusedRange={focusedRange}
        rangeColors={rangeColors}
        onChange={(e) => {}}
        editableDateInputs={false}
      />
    )
  );
}
function getMasterRange(date, ranges) {
  date = date.setHours(0, 0, 0, 0); //set hours, mns,sec,msec to 0 and converts to epoch time
  for (const rg of ranges) {
    if (rg.master) {
      const start = rg.startDate.setHours(0, 0, 0, 0);
      const end = rg.endDate.setHours(0, 0, 0, 0);
      if (date >= start && date <= end) return rg;
    }
  }
  return null;
}
let sel_cntr = 100;
export function CalendarRangeFlexFixed_Flex2({
  type, //Calendar range element for datesType="Flex_Fixed" (Flex dates, Fixed duration) or Flex_Flex (Flex dates,Flex duration)
  dates,
  del,
  rangeColors,
  disabled = false,
  onHandleNewSelection,
}) {
  const lang = useIntl().locale;
  const [selection, setSelection] = useState(null);
  const [ranges, setRanges] = useState([]);
  const [rangeLimits, setRangeLimits] = useState({});
  const [focusedRange, setFocusedRange] = useState([0, 0]);
  useEffect(() => {
    const ranges = [];
    _.orderBy(dates, ["from"], ["asc"]).map((date, idx) => {
      ranges.push({
        id: date.id,
        master: true, //differentiate ranges coming from PriceDatesTable vs the ones created in the CalendarRange component
        startDate: date.from,
        endDate: date.to,
        //promotion: date.promotion,
        color: rangeColors[idx],
        showDateDisplay: true,
        duration: type === "Flex_Fixed" ? date.duration : undefined,
        //bookingsByDay: date.bookingsByDay,
      });
    });
    setRanges(ranges);
    setRangeLimits({
      min: ranges[0].startDate,
      max: ranges[ranges.length - 1].endDate,
    });
  }, [dates]);
  useEffect(() => {
    if (selection !== null) {
      setRanges(_.orderBy([...ranges, selection], ["from"], ["asc"]));
    }
  }, [selection]);
  useEffect(() => {
    if (del !== null) {
      const rgs = [...ranges];
      _.remove(rgs, (rg) => {
        return (
          rg.startDate.setHours(0, 0, 0, 0) ===
            del.startDate.setHours(0, 0, 0, 0) &&
          rg.endDate.setHours(0, 0, 0, 0) === del.endDate.setHours(0, 0, 0, 0)
        );
      });
      setRanges(_.orderBy(rgs, ["from"], ["asc"]));
    }
  }, [del]);
  return (
    <DateRange
      locale={locales[lang]}
      weekStartsOn={1}
      ranges={ranges}
      showsSelectionPreview={true}
      dragSelectionEnabled={type === "Flex_Fixed" ? false : true}
      //preventSnapRefocus={true}
      onRangeFocusChange={(rg) => {
        setRanges(_.orderBy(ranges, ["startDate"], ["asc"])); //necessary to reset month and year calendar */
        setFocusedRange([rg[0], 0]);
      }}
      focusedRange={focusedRange}
      minDate={rangeLimits.min}
      maxDate={rangeLimits.max}
      onChange={(item) => {
        if (disabled) return;
        const date0 = item[Object.keys(item)[0]].startDate;
        const rg = getMasterRange(date0, ranges);
        if (rg) {
          const date1 =
            type === "Flex_Fixed"
              ? addDays(date0, rg.duration - 1)
              : item[Object.keys(item)[0]].endDate;
          if (date1.setHours(0, 0, 0, 0) <= rg.endDate.setHours(0, 0, 0, 0)) {
            const sel = {
              id: sel_cntr,
              master: false,
              master_id: rg.id,
              startDate: date0,
              endDate: date1,
              duration:
                type === "Flex_Fixed"
                  ? rg.duration
                  : differenceInCalendarDays(date1, date0) + 1,
              //promotion: rg.promotion,
              color: "#fed14c",
              rangeColor: rg.color,
              showDateDisplay: false,
            };
            setSelection(sel);
            sel_cntr++;
            onHandleNewSelection(sel);
          }
        }
      }}
    />
  );
}

let len = null;
export function CalendarRangePro({
  type, //Calendar range element for announce creation/edit
  dates,
  duration,
  del,
  disabled,
  onHandleNewSelection,
}) {
  const lang = useIntl().locale;
  const [selection, setSelection] = useState(null);
  const [ranges, setRanges] = useState([]);
  const [focusedRange, setFocusedRange] = useState([0, 0]);
  function initRange() {
    return [
      {
        startDate: new Date(),
        endDate: new Date(),
        init: true,
        showDateDisplay: false,
        color: "#9BC2E6",
      },
    ];
  }
  useEffect(() => {
    let rgs = [];
    _.orderBy(dates, ["dateStart"], ["asc"]).map((date, idx) => {
      rgs.push({
        startDate: date.period.dateStart,
        endDate: date.period.dateEnd,
        color: date.color,
        showDateDisplay: false,
      });
    });
    len = rgs.length;
    if (len === 0) rgs = initRange();
    setRanges(rgs);
    setFocusedRange([len > 0 ? len - 1 : 0, 0]);
  }, [dates]);
  useEffect(() => {
    if (selection !== null) {
      let rgs = _.filter([...ranges, selection], (item) => {
        return !item.init;
      });
      rgs = _.orderBy(rgs, ["startDate"], ["asc"]);
      setRanges(rgs);
      if (rgs.length > 0) setFocusedRange([rgs.length - 1, 0]);
    }
  }, [selection]);
  useEffect(() => {
    if (del !== null) {
      let rgs = [...ranges];
      _.remove(rgs, (rg) => {
        return (
          rg.startDate.setHours(0, 0, 0, 0) ===
            del.startDate.setHours(0, 0, 0, 0) &&
          rg.endDate.setHours(0, 0, 0, 0) === del.endDate.setHours(0, 0, 0, 0)
        );
      });
      if (rgs.length === 0) rgs = initRange();
      setRanges(rgs);
      setFocusedRange([rgs.length - 1, 0]);
    }
  }, [del]);
  return (
    <DateRange
      locale={locales[lang]}
      months={3}
      direction="horizontal"
      weekStartsOn={1}
      ranges={ranges}
      showsSelectionPreview={true}
      dragSelectionEnabled={type === "Fixed_Fixed" ? false : true}
      preventSnapRefocus={true}
      fixedHeight={true}
      focusedRange={focusedRange}
      onChange={(item) => {
        if (disabled) return;
        const date0 = item[Object.keys(item)[0]].startDate;
        const date1 =
          type === "Fixed_Fixed" || type === "Flex_Fixed"
            ? addDays(date0, duration - 1)
            : item[Object.keys(item)[0]].endDate;
        const color = len + 1 <= 10 ? colors[len] : getNRandomColors(1)[0];
        len += 1;
        setSelection({
          startDate: date0,
          endDate: date1,
          init: false,
          color,
          showDateDisplay: false,
        });
        onHandleNewSelection({
          bookings: 0, //duration property added in CalendarBlock component
          bookingsByDay: [],
          period: {dateStart: date0, dateEnd: date1},
          promotion: 0,
          color,
        });
      }}
    />
  );
}
