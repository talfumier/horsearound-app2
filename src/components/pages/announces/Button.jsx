import {FormattedMessage} from "react-intl";

function Button({id, type, label, style, onHandleClick}) {
  return (
    <button
      className="button ml-2 mr-1"
      key={id}
      id={id}
      type={type}
      style={style}
      onClick={(e) => {
        onHandleClick(type, id, e);
      }}
    >
      {<FormattedMessage id={label} />}
    </button>
  );
}

export default Button;
