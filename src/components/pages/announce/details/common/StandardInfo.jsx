import {FormattedMessage} from "react-intl";

function StandardInfo({field, lang, id}) {
  let cond = true;
  if (lang !== null) cond = field ? field[lang] && field[lang] !== "" : false;
  else cond = field ? true : false;
  return (
    <div className="mt-1 mb-3 w-100" style={{whiteSpace: "pre"}}>
      <div>
        <h5 className="media-heading pl-0 mr-4 font-weight-bold">
          <FormattedMessage id={id} />
        </h5>
        <p className="pl-4 mb-0">
          {cond ? (lang !== null ? field[lang] : field) : null}
        </p>
      </div>
    </div>
  );
}

export default StandardInfo;
