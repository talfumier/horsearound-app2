import React, {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {useCookies} from "react-cookie";
import {StarRatingLevel} from "../../../../utils/Ratings";
import "../../../../../../css/comment.css";
import {Divider, Avatar, Grid, Paper} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import _ from "lodash";
import {getFormattedDate} from "../../../../utils/utilityFunctions";
import {decodeJWT} from "../../../../../../services/httpUsers.js";

function CommentsBlock({data, onEdit, onDelete}) {
  const intl = useIntl();
  const [cookies] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [comments, setComments] = useState(null);
  useEffect(() => {
    setComments(data);
  }, [data]);
  function getDisabled(id) {
    if (!cookies.user) return true;
    return currentUser._id !== id;
  }
  function handleEditComment(id) {
    onEdit(id);
  }
  function handleDeleteComment(id) {
    onDelete(id);
  }
  return (
    comments !== null && (
      <div className="row align-items-center ml-2 mr-0 p-0">
        <Paper
          elevation={3}
          style={{
            marginTop: "20px",
            marginRight: "50px",
            marginBottom: "20px",
            padding: "20px",
            paddingRight: "0",
          }}
        >
          {comments && comments.length >= 1 ? (
            _.orderBy(
              comments,
              (comment) => getFormattedDate(comment.creationDate),
              ["desc"]
            ).map((comment, idx) => {
              return (
                <React.Fragment key={idx}>
                  <Grid container wrap="wrap" pr={0}>
                    <Grid item xs={0.5}>
                      <Avatar
                        alt={comment.firstName}
                        src={
                          "https://ui-avatars.com/api/?uppercase=false&name=" +
                          comment.firstName +
                          "&background=random"
                        }
                      />
                    </Grid>
                    <Grid item justifyContent="left" xs={1.5}>
                      <h5
                        style={{
                          color: "blue",
                          fontSize: "1.5rem",
                          margin: 0,
                        }}
                      >{`${comment.firstName} (${comment.city})`}</h5>
                      <h5>{`${getFormattedDate(comment.creationDate)}`}</h5>
                      <StarRatingLevel
                        level={
                          (comment.cavalryNote +
                            comment.environmentLandscapeNote +
                            comment.qualityPriceNote +
                            comment.receptionNote) /
                          4
                        }
                      ></StarRatingLevel>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "src.components.announcePage.comments.translateIconTooltip",
                        })}
                        arrow
                      >
                        <button
                          className="fa fa-language fa-2x mt-1 mb-4"
                          style={{color: "#7AA095", border: "0"}}
                        ></button>
                      </Tooltip>
                    </Grid>
                    <Grid item justifyContent="left" xs={9}>
                      <h5
                        className="m-0 mr-5 font-weight-bold"
                        style={{
                          fontSize: "1.5rem",
                          overflowWrap: "break-word",
                        }}
                      >
                        {comment.title}
                      </h5>
                      <p
                        style={{
                          fontSize: "1.5rem",
                          paddingTop: "10px",
                          paddingRight: "15px",
                          textAlign: "justify",
                          overflowWrap: "break-word",
                        }}
                      >
                        {comment.text}
                      </p>
                      {idx + 1 < comments.length && (
                        <Divider
                          flexItem
                          variant="fullWidth"
                          style={{marginTop: "5px", marginBottom: "10px"}}
                        />
                      )}
                    </Grid>
                    {!getDisabled(comment.id_user) && (
                      <Grid item xs={0.85} ml={1.5} mr={0}>
                        <Tooltip
                          title={intl.formatMessage({
                            id: "src.components.announcePage.comments.editIconTooltip",
                          })}
                          arrow
                        >
                          <button
                            className="fa fa-edit fa-2x "
                            style={{color: "#7AA095", border: "0"}}
                            onClick={() => {
                              handleEditComment(comment._id);
                            }}
                          ></button>
                        </Tooltip>
                        <Tooltip
                          title={intl.formatMessage({
                            id: "src.components.announcePage.comments.deleteIconTooltip",
                          })}
                          arrow
                        >
                          <button
                            className="fa fa-trash fa-2x ml-5 mr-0 pr-0"
                            style={{color: "#7AA095", border: "0"}}
                            onClick={() => {
                              handleDeleteComment(comment._id);
                            }}
                          ></button>
                        </Tooltip>
                      </Grid>
                    )}
                  </Grid>
                </React.Fragment>
              );
            })
          ) : (
            <div
              style={{
                width: "58vw",
                height: "20px",
              }}
            >
              <h5 style={{color: "#C25810", paddingLeft: "10px"}}>
                <FormattedMessage id="src.components.announcePage.comments.noComments"></FormattedMessage>
              </h5>
            </div>
          )}
          ;
        </Paper>
      </div>
    )
  );
}

export default CommentsBlock;
