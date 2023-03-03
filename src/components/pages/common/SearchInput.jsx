import React, {useState} from "react";
import {WithContext as ReactTags} from "react-tag-input";
import {FormattedMessage, useIntl} from "react-intl";
import "../../../css/searchInput.css";
import "../../../css/button.css";
import {toastError} from "./toastSwal/ToastMessages.js";
import {ToastContainer} from "react-toastify";

function SearchInput({tags, onHandleChange}) {
  const {formatMessage} = useIntl();
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
    if (state.tags.length === 0)
      toastError(
        formatMessage({
          id: "src.components.annoncesPage.searchbar.searchTagMissing",
        })
      );
    onHandleChange(state.tags);
  }
  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="row col-10 align-items-center">
        <ReactTags
          removeComponent={RemoveComponent}
          allowDragDrop={false}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          delimiters={[13]}
          onClearAll={handleClearAll}
          placeholder={formatMessage({
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
    </>
  );
}

export default SearchInput;
