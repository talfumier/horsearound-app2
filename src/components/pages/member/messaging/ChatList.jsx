import {Avatar, Card} from "@mui/material";
import {useCookies} from "react-cookie";
import {decodeJWT} from "../../../../services/httpUsers.js";
import {getFormattedDate} from "../../utils/utilityFunctions.js";

function ChatList({messages, onHandleReply, onHandleRead}) {
  const [cookies] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  function checkSource(id_sender) {
    //check if a message has been created by the logged in user or not
    return currentUser._id === id_sender;
  }
  let avatar = [];
  return (
    <div
      style={{fontSize: "1.2rem", overflowY: "auto", height: 580}}
      className="mt-3 pt-3 px-4"
    >
      {messages.map((message, idx) => {
        avatar.push(
          <Avatar
            alt={message.msg.id_sender.firstName}
            src={`https://ui-avatars.com/api/?uppercase=false&name=${message.msg.id_sender.firstName}&background=random`}
            style={{marginLeft: "10px"}}
          />
        );
        return (
          <Card
            key={message.msg._id}
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
                <tr key={message.msg._id}>
                  <th style={{width: "65px"}} scope="row">
                    {avatar[idx]}
                  </th>
                  <td>
                    <div className="d-flex" style={{fontSize: "1.2rem"}}>
                      <div
                        className="form-control col-8 mr-3 pt-2"
                        style={{backgroundColor: "transparent"}}
                      >
                        {message.msg.title}
                      </div>
                      {!checkSource(message.msg.id_sender._id) ? (
                        <button
                          className="fa fa-reply fa-lg ml-0 p-0 mr-3"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "blue",
                          }}
                          onClick={() => {
                            onHandleReply(
                              avatar[idx],
                              typeof message.msg.title !== "undefined"
                                ? message.msg.title
                                : "",
                              message.msg.id_sender,
                              message.msg._id,
                              message.conv
                            );
                          }}
                        ></button>
                      ) : (
                        <span style={{color: "transparent"}}> {`rrrrr`}</span>
                      )}
                      <div className="d-flex justify-content-left mr-4 pr-2">
                        <span className="mr-4" style={{width: 30}}>
                          {getFormattedDate(message.msg.sendDate)}
                        </span>
                        <i
                          className={`fa ${
                            !message.msg.isRead
                              ? "fa-envelope"
                              : "fa-envelope-open-o"
                          } fa-2x my-0`}
                          style={{
                            color: "orange", //message.msg.isRead ? "green" : "red",
                            marginLeft: 80,
                            cursor:
                              message.msg.id_sender._id === currentUser._id
                                ? null
                                : "pointer",
                          }}
                          onClick={() => {
                            if (message.msg.id_sender._id === currentUser._id)
                              return;
                            onHandleRead(message.msg._id, !message.msg.isRead);
                          }}
                        ></i>
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
                      value={message.msg.message}
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
