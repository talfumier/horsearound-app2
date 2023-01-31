import {useState, useEffect} from "react";
import {useIntl} from "react-intl";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {DateRangePicker} from "react-date-range";
import {addDays} from "date-fns";
import * as locales from "date-fns/locale";
import {defaultStaticRanges, defaultInputRanges} from "./StaticInputRanges";
import styles from "./datePicker.css";
//https://hypeserver.github.io/react-date-range/

function DatePicker({filter, onHandleChange}) {
  const lang = useIntl().locale;
  const [state, setState] = useState([]);
  useEffect(() => {
    let ranges = {
        startDate: new Date(),
        endDate: addDays(new Date(), 6),
        key: "selection",
      },
      cs = 0;
    if (Object.keys(filter.dates.selection).length === 3) {
      ranges = filter.dates.selection;
      cs = 1;
    }
    if (cs === 0) handleSelect(ranges);
    setState([ranges]);
  }, []);
  function handleSelect(ranges) {
    onHandleChange(ranges);
  }
  return (
    state.length === 1 && (
      <DateRangePicker
        //className={styles}
        locale={locales[lang]}
        weekStartsOn={1}
        onChange={(item) => {
          setState([item.selection]);
          handleSelect(item.selection);
        }}
        staticRanges={defaultStaticRanges}
        inputRanges={defaultInputRanges}
        ranges={state}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
      />
    )
  );
}

export default DatePicker;
