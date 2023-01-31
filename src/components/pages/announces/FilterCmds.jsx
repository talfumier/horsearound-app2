import {FormattedMessage} from "react-intl";
import _ from "lodash";

function FilterCmds({onRemoveFilter, onApplyFilter}) {
  return (
    <div className="d-flex flex-row-reverse">
      <button type="button" className="btn btn-info" onClick={onRemoveFilter}>
        <FormattedMessage id="src.components.annoncesPage.searchbar.removeFilter" />
      </button>
      <button type="button" className="btn btn-primary" onClick={onApplyFilter}>
        <FormattedMessage id="src.components.annoncesPage.searchbar.applyFilter" />
      </button>
    </div>
  );
}

export default FilterCmds;
