import {useState, useEffect} from "react";
import {useIntl} from "react-intl";
import {useResizeDetector} from "react-resize-detector";
import NavBarPopper from "../../../common/NavBarPopper.jsx";
import {getSubToType} from "../../../announce/PageContent.jsx";

export function formatValue(id, value, formatMessage) {
  if (value.length === 0 || typeof value === "undefined") return value;
  if (id === "activities")
    return `${formatMessage({
      id: `src.components.allPages.Menu.navbar.activities.types.${
        getSubToType()[value]
      }.subactivities.${value}`,
    })}`;
  else
    return `${formatMessage({
      id: `src.components.allPages.Menu.navbar.destinations.continents.${value[0]}.continentName`,
    })} - ${formatMessage({
      id: `src.components.allPages.Menu.navbar.destinations.continents.${value[0]}.countries.${value[1]}`,
    })}`;
}

function DropDown({id, intlId, ul, name, value: val, color, onHandleChange}) {
  const {width, height, ref} = useResizeDetector();
  const {formatMessage} = useIntl();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(val);
  useEffect(() => {
    setValue(val);
  }, [val]);
  function handleToggle(e) {
    setOpen(!open);
  }
  function handleClose(e) {
    if (e.target.id !== "") {
      const arr = e.target.id.split("/");
      setValue(id !== "activities" ? arr : arr[1]);
      onHandleChange(id !== "activities" ? arr : arr[1]);
    }
    setOpen(false);
  }
  return (
    <div className="dropdown megaDropMenu">
      <div className="d-flex">
        <input
          id={`AnnounceForm${name}`}
          type="text"
          ref={ref}
          className="form-control mt-2"
          onClick={handleToggle}
          readOnly={true}
          value={formatValue(id, value, formatMessage)}
          style={{
            cursor: "pointer",
            border: "solid 1px",
            borderColor: color,
          }}
          placeholder={formatMessage({
            id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.${name}PH`,
          })}
        ></input>
        <i
          className="fa fa-trash fa-lg ml-3 mt-4"
          style={{
            position: "absolute",
            cursor: " pointer",
            color: "#7aa095",
            left: (typeof width !== "undefined" ? width : 50) - 7,
            top: "0px",
          }}
          onClick={() => {
            setValue([]);
            onHandleChange([]);
          }}
        ></i>
      </div>
      <NavBarPopper
        id={id}
        open={open}
        anchor={ref.current}
        onClose={handleClose}
        intlId={intlId}
        ul={ul}
        noLink={true}
      ></NavBarPopper>
    </div>
  );
}

export default DropDown;
