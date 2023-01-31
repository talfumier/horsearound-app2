import React, {useState} from "react";
import {WithContext as ReactTags} from "react-tag-input";
import {FormattedMessage, useIntl} from "react-intl";
import "../../../css/searchInput.css";
import "../../../css/button.css";

function SearchInput({tags, onHandleChange}) {
  const intl = useIntl();
  const [state, setState] = useState({tags: tags});
  const RemoveComponent = ({index}) => {
    return (
      <button
        className="btn bg-transparent rounded-0"
        onClick={() => {
          handleDelete(index);
        }}
      >
        <i
          className="fa fa-trash"
          style={{color: "white", fontSize: "15px", padding: "0"}}
        ></i>
      </button>
    );
  };
  function handleDelete(i) {
    const {tags} = state;
    tags.splice(i, 1);
    setState({tags});
  }
  function handleAddition(tag) {
    const {tags} = state;
    tags.push(tag);
    setState({tags});
  }
  function handleClearAll() {
    setState({tags: []});
    onHandleChange([]);
  }
  function handleSearch() {
    onHandleChange(state.tags);
  }
  return (
    <div className="row col-10 align-items-center">
      <ReactTags
        removeComponent={RemoveComponent}
        allowDragDrop={false}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        delimiters={[13]}
        onClearAll={handleClearAll}
        placeholder={intl.formatMessage({
          id: "src.components.annoncesPage.searchbar.searchPlaceHolder",
        })}
        minQueryLength={2}
        maxLength={150}
        autofocus={false}
        allowDeleteFromEmptyInput={true}
        allowUnique={true}
        inline={true}
        allowAdditionFromPaste={true}
        tags={state.tags}
      ></ReactTags>

      <button className="btn btn-success ml-5" onClick={handleSearch}>
        <FormattedMessage id="src.components.annoncesPage.searchbar.searchButton"></FormattedMessage>
      </button>
      <button
        id="clearAll"
        className="btn btn-success ml-1"
        onClick={handleClearAll}
      >
        <FormattedMessage id="src.components.annoncesPage.searchbar.clearSearchButton"></FormattedMessage>
      </button>
    </div>
  );
}

export default SearchInput;
