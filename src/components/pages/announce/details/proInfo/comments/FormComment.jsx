import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Modal, Box, FormGroup} from "@mui/material";
import "../../../../../../css/comment.css";

function FormComment({open, data, onClose, onSubmit, onDelete}) {
  const intl = useIntl();
  const [text, setText] = useState("");
  const [desc, setDesc] = useState("");
  const [selected, setSelected] = useState({});
  useEffect(() => {
    setText(data.text);
    setDesc(data.desc);
    setSelected(data.selected);
  }, [data]);
  function resetStates() {
    setText("");
    setDesc("");
    setSelected(initSelected());
  }
  const cats = {
    1: "environmentLandscapeNote",
    2: "cavalryNote",
    4: "receptionNote",
    5: "qualityPriceNote",
  };
  function initSelected() {
    const obj = {};
    Object.keys(cats).map((cat) => {
      obj[cats[cat]] = "default";
    });
    return obj;
  }
  function handleClose() {
    resetStates();
    onClose();
  }
  function handleSubmit() {
    onSubmit(data._id, text, desc, selected);
    handleClose();
  }
  function handleChange(type, value) {
    switch (type) {
      case "title":
        setText(value);
        break;
      case "desc":
        setDesc(value);
    }
  }
  function handleKeyUp(type, key) {
    if (key === "Escape") {
      switch (type) {
        case "title":
          setText("");
          break;
        case "desc":
          setDesc("");
      }
    }
  }
  function handleSelectChange(cat, value) {
    const slctd = {...selected};
    slctd[cat] = value;
    setSelected(slctd);
  }
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: intl.locale === "fr" ? "38%" : "34%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
  };
  const labelStyle = {color: "#1F4E78", fontStyle: "italic"};
  return (
    <Modal disableEscapeKeyDown open={open} onClose={handleClose}>
      <Box sx={style}>
        <FormGroup>
          <div className="row m-0">
            <label htmlFor="title" className="mb-2" style={labelStyle}>
              {intl.formatMessage({
                id: "src.components.announcePage.comments.titleLabel",
              })}
            </label>
            <input
              id="title"
              className="col-md-12 comment mt-2"
              type="text"
              value={text}
              onChange={(e) => {
                handleChange("title", e.target.value);
              }}
              onKeyUp={(e) => {
                handleKeyUp("title", e.code);
              }}
              placeholder={intl.formatMessage({
                id: "src.components.announcePage.comments.placeholder",
              })}
            ></input>
            <label htmlFor="desc" className="mt-3 mb-1" style={labelStyle}>
              {intl.formatMessage({
                id: "src.components.announcePage.comments.descLabel",
              })}
            </label>
            <textarea
              id="desc"
              className="col-md-12 comment mt-2"
              type="textarea"
              placeholder={intl.formatMessage({
                id: "src.components.announcePage.comments.placeholder",
              })}
              value={desc}
              onChange={(e) => {
                handleChange("desc", e.target.value);
              }}
              onKeyUp={(e) => {
                handleKeyUp("desc", e.code);
              }}
            ></textarea>
            <label
              className="col-md-12 mt-3 mb-2 text-center"
              style={labelStyle}
            >
              {intl.formatMessage({
                id: "src.components.announcePage.comments.noteLabel",
              })}
            </label>
          </div>
          <div className="row text-center ml-3">
            {Object.keys(cats).map((cat, idx) => {
              return (
                <div key={cat}>
                  <label key={idx} htmlFor={cat}>
                    {intl.formatMessage({
                      id: `src.components.rating.DetailledRating.title${cat}`,
                    })}
                  </label>
                  <select
                    id={cat}
                    className="form-control mb-3"
                    value={selected[cats[cat]]}
                    onChange={(e) => {
                      handleSelectChange(cats[cat], e.target.value);
                    }}
                  >
                    {
                      <option value="default" disabled hidden>
                        {intl.formatMessage({
                          id: "src.components.announcePage.comments.placeHolderSelect",
                        })}
                      </option>
                    }
                    {[1, 2, 3, 4, 5].map((option) => {
                      return (
                        <option key={option} value={option}>
                          {intl.formatMessage({
                            id: `src.components.announcePage.comments.ratings.${option}`,
                          })}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            })}
          </div>
          <div className="d-flex flex-row-reverse justify-content-between">
            <div>
              <button
                className="btn btn-success m-0 mt-2 ml-3"
                onClick={handleClose}
              >
                <FormattedMessage id="src.components.announcePage.comments.cancelButton"></FormattedMessage>
              </button>
              <button
                className="btn btn-success m-0 mt-2"
                onClick={handleSubmit}
              >
                <FormattedMessage id="src.components.announcePage.comments.postButton"></FormattedMessage>
              </button>
            </div>
            {data.del && (
              <button
                className="btn btn-success m-0 mt-2"
                onClick={() => {
                  onDelete(data._id);
                }}
              >
                <FormattedMessage id="src.components.announcePage.comments.deleteButton"></FormattedMessage>
                <i className="fa fa-trash ml-1 mr-0 pl-2 pr-0"></i>
              </button>
            )}
          </div>
        </FormGroup>
      </Box>
    </Modal>
  );
}

export default FormComment;
