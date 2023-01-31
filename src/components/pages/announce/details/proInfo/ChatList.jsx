import {FormattedMessage} from "react-intl";
import {Avatar, Card} from "@mui/material";
import {useCookies} from "react-cookie";
import {decodeJWT} from "../../../../../services/httpUsers.js";
import {getFormattedDate} from "../../../utils/utilityFunctions.js";

function ChatList({messages, onHandleReply}) {
  const [cookies] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  function checkSource(id_sender) {
    //check if a message has been created by the logged in user or not
    return currentUser._id === id_sender;
  }
  return (
    <div className="overflow-auto" style={{fontSize: "1.2rem"}}>
      {messages.map((message) => {
        return (
          <Card
            key={message._id}
            variant="outlined"
            style={{
              width: "100%",
              borderWidth: "1px",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            <table
              key={message._id}
              className="table m-0 pb-0"
              style={{border: "none"}}
            >
              <tbody className="m-0 p-0">
                <tr key={message._id}>
                  <th style={{width: "65px"}} scope="row">
                    <Avatar
                      alt={message.id_sender.firstName}
                      src={
                        "https://ui-avatars.com/api/?uppercase=false&name=" +
                        message.id_sender.firstName +
                        "&background=random"
                      }
                      style={{marginLeft: "10px"}}
                    />
                  </th>
                  <td>
                    <div className="d-flex" style={{fontSize: "1.2rem"}}>
                      <div
                        className="form-control col-8 mr-3 pt-2"
                        style={{backgroundColor: "transparent"}}
                      >
                        {message.title}
                      </div>
                      {!checkSource(message.id_sender._id) && (
                        <button
                          className="fa fa-reply fa-lg ml-0 p-0 mr-3"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "blue",
                          }}
                          onClick={() => {
                            onHandleReply(
                              typeof message.title !== "undefined"
                                ? message.title
                                : ""
                            );
                          }}
                        ></button>
                      )}
                      <div className="p-2">
                        {getFormattedDate(message.sendDate)}
                        {checkSource(message.id_sender._id) ? (
                          message.isRead ? (
                            <span
                              style={{
                                color: "green",
                                paddingLeft: 30,
                              }}
                            >
                              <FormattedMessage id="src.components.bookingPage.StepTwoContent.read" />
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "orange",
                                paddingLeft: 30,
                              }}
                            >
                              <FormattedMessage id="src.components.bookingPage.StepTwoContent.unread" />
                            </span>
                          )
                        ) : null}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="m-0 p-0">
                  <th scope="row"></th>
                  <td className="m-0 pr-4">
                    <textarea
                      className="form-control col-12 "
                      style={{backgroundColor: "transparent"}}
                      readOnly={true}
                      value={message.message}
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        );
      })}
    </div>
  );
}

export default ChatList;
