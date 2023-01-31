import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {useCookies} from "react-cookie";
import _ from "lodash";
import CommentsBlock from "./CommentsBlock";
import FormComment from "./FormComment";
import {decodeJWT} from "../../../../../../services/httpUsers.js";
import {
  postComment,
  patchComment,
  deleteComment,
} from "../../../../../../services/httpAnnounces.js";
import {errorHandlingToast} from "../../../../../../services/utilsFunctions.js";

function AnnounceComments({announce_id, bookings, data}) {
  const lang = useIntl().locale;
  const [cookies] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(null);
  useEffect(() => {
    if (!cookies.user) return setDisabled(true);
    if (currentUser.type === "pro") return setDisabled(true);
    const bkgs = _.filter(bookings, (bkg) => {
      return (
        bkg.id_user === currentUser._id && bkg.steps["4"].validated !== null
      ); //check if current user holds a 'validated' booking for this announce
    });
    setDisabled(bkgs.length > 0 ? false : true);
  }, [cookies.user, bookings]);
  const emptyComment = {
    creationDate: null,
    text: "",
    desc: "",
    selected: {
      environmentLandscapeNote: 3,
      cavalryNote: 3,
      receptionNote: 3,
      qualityPriceNote: 3,
    },
    del: false,
  };
  const [comment, setComment] = useState(emptyComment);
  const [comments, setComments] = useState(data);
  function handleOpen(cs = 0) {
    if (cs === 1) setComment(emptyComment); //Reset empty comment when new comment case
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  function getCommentData(id, del) {
    for (const idx in comments) {
      if (comments[idx]._id === id)
        return {
          _id: comments[idx]._id,
          creationDate: comments[idx].creationDate,
          text: comments[idx].title,
          desc: comments[idx].text,
          selected: {
            environmentLandscapeNote: comments[idx].environmentLandscapeNote,
            cavalryNote: comments[idx].cavalryNote,
            receptionNote: comments[idx].receptionNote,
            qualityPriceNote: comments[idx].qualityPriceNote,
          },
          del,
        };
    }
  }
  function handleEditComment(id, del) {
    setComment(getCommentData(id, del));
    handleOpen();
  }
  async function handleDelete(id) {
    const res = await deleteComment(id, cookies.user);
    if (await errorHandlingToast(res, lang)) return;
    setComments(
      _.filter(comments, (comment) => {
        return comment._id !== id;
      })
    );
    setComment(emptyComment);
    handleClose();
  }
  async function handleSubmit(id, text, desc, selected) {
    //id=comment._id
    if (
      text === "" &&
      desc === "" &&
      Object.values(selected).join() ===
        ["default", "default", "default", "default"].join()
    )
      return; //empty new comment
    let i = 0,
      cs = 0,
      comment = {};
    const data = _.cloneDeep(comments),
      n = data.length;
    if (id) {
      //id=undefined for new comment
      for (i = 0; i < n; i++) {
        if (data[i]._id === id) {
          cs = 1; //existing comment
          if (data[i].title !== text) {
            data[i].title = text;
            comment.title = text;
            cs = 2;
          }
          if (data[i].text !== desc) {
            data[i].text = desc;
            comment.text = desc;
            cs = 2;
          }
          Object.keys(selected).map((key) => {
            if (data[i][key] !== Number(selected[key])) {
              data[i][key] = Number(selected[key]);
              comment[key] = Number(selected[key]);
              cs = 2;
            }
          });
          break;
        }
      }
    }
    if (cs === 2) {
      //existing comment that has actually changed
      data[i].creationDate = new Date();
      comment.creationDate = new Date();
      const res = await patchComment(id, comment, cookies.user);
      if (await errorHandlingToast(res, lang)) return;
    }
    if (cs === 0) {
      //new non empty comment
      comment = {
        archived: false,
        cavalryNote: selected.cavalryNote,
        city: _.startCase(currentUser.address.city.toLowerCase()),
        text: desc,
        creationDate: new Date(),
        environmentLandscapeNote: selected.environmentLandscapeNote,
        firstName: _.startCase(currentUser.firstName.toLowerCase()),
        id_announce: announce_id,
        id_user: currentUser._id,
        qualityPriceNote: selected.qualityPriceNote,
        receptionNote: selected.receptionNote,
        title: text,
      };
      const res = await postComment(comment, cookies.user);
      if (!errorHandlingToast(res, lang))
        data.push({...comment, _id: res.data.data._id});
      else return;
    }
    setComments(data);
  }
  return (
    disabled !== null && (
      <div className="row ml-0 mt-0 mb-1 pt-1">
        <div className="col-md3">
          <h5 className="media-heading ml-4 font-weight-bold">
            <FormattedMessage id="src.components.announcePage.comments.title" />
          </h5>
        </div>
        {cookies.user && (
          <div className="col-1 m-0 ml-4">
            <button
              className="btn btn-success m-0"
              disabled={disabled}
              onClick={() => {
                handleOpen(1);
              }}
            >
              <FormattedMessage id="src.components.announcePage.comments.addButton"></FormattedMessage>
            </button>
          </div>
        )}
        {/*  {!cookies.user && (
          <div className="d-inline-flex alert alert-danger justify-content-center m-0 p-0 pl-4 pr-4 ">
            <h5>
              <FormattedMessage id="src.components.announcePage.comments.userLoggedIn"></FormattedMessage>
            </h5>
          </div>
        )} */}
        <FormComment
          open={open}
          data={comment}
          onClose={handleClose}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
        ></FormComment>
        <div className="ml-4 mr-12 mt-1 mb-3 ">
          <CommentsBlock
            data={comments}
            onEdit={(id) => {
              handleEditComment(id, false);
            }}
            onDelete={(id) => {
              handleEditComment(id, true);
            }}
          ></CommentsBlock>
        </div>
      </div>
    )
  );
}

export default AnnounceComments;
