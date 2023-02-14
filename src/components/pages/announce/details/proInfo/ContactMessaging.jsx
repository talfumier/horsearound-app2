import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import _ from "lodash";
import {parseISO} from "date-fns";
import {useCookies} from "react-cookie";
import {
  getConversation,
  patchConversation,
  postConversation,
  postMessage,
} from "../../../../../services/httpAnnounces.js";
import {decodeJWT} from "../../../../../services/httpUsers.js";
import {errorHandlingToast} from "./../../../../../services/utilsFunctions";
import ChatList from "./ChatList.jsx";

function ContactMessaging({proId}) {
  //proId >>> proId id_user
  const lang = useIntl().locale;
  const [cookies] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [state, setState] = useState({
    title: "",
    message: "",
    conversation: {},
  });
  function sortMessages(conv) {
    const ordered = _.orderBy(
      conv.messages,
      (msg) => parseISO(msg.sendDate).getTime(),
      ["desc"]
    );
    return {...conv, messages: ordered};
  }
  useEffect(() => {
    async function loadData(signal) {
      const res = await getConversation(
        currentUser._id,
        proId,
        cookies.user,
        signal
      );
      if (await errorHandlingToast(res, lang, false)) return;
      if (res.data.length !== 0) {
        //There is an existing conversation
        setState({...state, conversation: sortMessages(res.data[0])});
      }
    }
    const abortController = new AbortController();
    loadData(abortController.signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, []);
  function getIdArray(msgs) {
    const lst = [];
    msgs.map((msg) => {
      lst.push(msg._id);
    });
    return lst;
  }
  async function createConversation(msg) {
    const abortController = new AbortController();
    const res = await postConversation(
      {users: [currentUser._id, proId], messages: [msg._id]},
      cookies.user,
      abortController.signal
    );
    if (await errorHandlingToast(res, lang)) {
      abortController.abort();
      return;
    }
    res.data.data.messages = [msg];
    return res.data.data;
  }
  async function sendMessage() {
    const abortController = new AbortController();
    let res = await postMessage(
      {
        id_sender: currentUser._id,
        id_receiver: proId,
        title: state.title,
        message: state.message,
      },
      cookies.user,
      abortController.signal
    );
    if (await errorHandlingToast(res, lang)) {
      abortController.abort();
      return;
    }
    let conv = null;
    if (Object.keys(state.conversation).length > 0) {
      conv = {...state.conversation};
      conv.messages.push(res.data.data);
      conv = sortMessages(conv);
      res = await patchConversation(
        conv._id,
        {
          messages: getIdArray(conv.messages),
        },
        cookies.user,
        abortController.signal
      );
      if (await errorHandlingToast(res, lang)) {
        abortController.abort();
        return;
      }
    } else {
      //create conversation
      conv = await createConversation(res.data.data);
      if (conv === null) return;
    }
    setState({...state, message: "", conversation: conv});
  }
  function handleReply(txt) {
    setState({
      ...state,
      title: "Re: " + txt,
      message: "",
    });
  }
  return (
    <div>
      <div className="infoTitle ml-2 mt-3 ">
        <h5 style={{fontSize: "1.6rem", marginTop: "15px"}}>
          <strong>
            <FormattedMessage id="src.components.bookingPage.StepTwoContent.label" />
          </strong>
        </h5>
      </div>
      <div className="d-flex flex-row justify-content-between">
        <div className="col-md-6 pl-3 ">
          <label htmlFor="title" className="mb-2">
            <h6 style={{fontSize: "1.4rem", marginTop: "15px"}}>
              <FormattedMessage id="src.components.bookingPage.StepTwoContent.label1" />
            </h6>
          </label>
          <div className="d-flex">
            <input
              id="title"
              className="form-control "
              value={state.title}
              onChange={(e) => setState({...state, title: e.target.value})}
              style={{width: "60%", borderRadius: 10}}
            />
            <a className="btn btn-success ml-auto" onClick={sendMessage}>
              <FormattedMessage id="src.components.bookingPage.StepTwoContent.send" />
            </a>
          </div>
          <label htmlFor="message" className="mb-2">
            <h6 style={{fontSize: "1.4rem", marginTop: "15px"}}>
              <FormattedMessage id="src.components.bookingPage.StepTwoContent.label2" />
              {" *"}
            </h6>
          </label>
          <textarea
            id="message"
            className="form-control"
            rows="6"
            value={state.message}
            onChange={(e) => setState({...state, message: e.target.value})}
            style={{borderRadius: 10}}
          />
        </div>
        <div className="col" style={{marginLeft: "50px", marginRight: 0}}>
          <ChatList
            messages={
              typeof state.conversation.messages !== "undefined"
                ? state.conversation.messages
                : []
            }
            onHandleReply={handleReply}
          />
        </div>
      </div>
    </div>
  );
}

export default ContactMessaging;
