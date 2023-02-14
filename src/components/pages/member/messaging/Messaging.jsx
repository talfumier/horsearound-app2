import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import _ from "lodash";
import {parseISO} from "date-fns";
import {useCookies} from "react-cookie";
import {
  getConversations,
  patchConversation,
  postMessage,
  patchMessage,
} from "../../../../services/httpAnnounces.js";
import {decodeJWT} from "../../../../services/httpUsers.js";
import {errorHandlingToast} from "../../../../services/utilsFunctions.js";
import ChatList from "./ChatList.jsx";

function Messaging() {
  const {locale} = useIntl();
  const [cookies] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const emptyState = {
    to: null,
    id_receiver: null,
    title: "",
    message: "",
    conversation: null,
  };
  const [state, setState] = useState(emptyState);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState({});
  function sortMessages(msgs) {
    const ordered = _.orderBy(
      msgs,
      (message) => parseISO(message.msg.sendDate).getTime(),
      ["desc"]
    );
    return ordered;
  }
  useEffect(() => {
    function prepareData(data) {
      const msgs = [],
        convs = {};
      let conv_msgs = [];
      data.map((conv) => {
        conv_msgs = [];
        conv.messages.map((msg) => {
          msgs.push({msg, conv: conv._id});
          conv_msgs.push(msg._id);
        });
        convs[conv._id] = conv_msgs;
      });
      return {msgs: sortMessages(msgs), convs};
    }
    async function loadData(signal) {
      const res = await getConversations(currentUser._id, cookies.user, signal);
      if (await errorHandlingToast(res, locale, false)) return;
      if (res.data.length !== 0) {
        const data = prepareData(res.data);
        setMessages(data.msgs);
        setConversations(data.convs);
      }
    }
    const abortController = new AbortController();
    loadData(abortController.signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, []);
  async function sendMessage() {
    const abortController = new AbortController();
    let res = await postMessage(
      {
        id_sender: currentUser._id,
        id_receiver: state.id_receiver._id,
        title: state.title,
        message: state.message,
      },
      cookies.user,
      abortController.signal
    );
    if (await errorHandlingToast(res, locale)) {
      abortController.abort();
      return;
    }
    const msgs = _.cloneDeep(messages);
    msgs.push({msg: res.data.data, conv: state.conversation});
    const convs = {...conversations};
    convs[state.conversation].push(res.data.data._id); //add newly created message _id to conversation
    res = await patchConversation(
      state.conversation,
      {
        messages: convs[state.conversation],
      },
      cookies.user,
      abortController.signal
    );
    if (await errorHandlingToast(res, locale)) {
      abortController.abort();
      return;
    }
    setConversations(convs);
    setMessages(sortMessages(msgs));
    setState(emptyState);
  }
  async function setReadStatus(id, value) {
    const msgs = _.cloneDeep(messages);
    let flg = false;
    msgs.map((msg, idx) => {
      if (msg.msg._id === id && msg.msg.isRead === value) flg = true;
    });
    if (flg) return;
    const abortController = new AbortController();
    const res = await patchMessage(
      id,
      {
        isRead: value,
      },
      cookies.user,
      abortController.signal
    );
    if (await errorHandlingToast(res, locale)) {
      abortController.abort();
      return;
    }
    msgs.map((msg, idx) => {
      if (msg.msg._id === id) msgs[idx].msg.isRead = value;
    });
    setMessages(msgs);
  }
  function handleReply(avatar, title, id_receiver, msg_id, conv_id) {
    //msg_id is the incomingl message that is being replied >>> read=true, it is assumed that incoming message is read before repying to it
    setReadStatus(msg_id, true);
    setState({
      to: avatar,
      id_receiver,
      title: "Re: " + title,
      message: "",
      conversation: conv_id,
    });
  }
  return (
    <div>
      <div className="d-flex flex-row justify-content-between">
        <div className="col-md-6 pl-3 ">
          <div className="d-flex mb-4 pb-2">
            <h6
              style={{
                fontSize: "1.5rem",
                marginTop: "10px",
                marginRight: 20,
                fontWeight: "bolder",
              }}
            >
              <FormattedMessage id="src.components.bookingPage.StepTwoContent.label0" />
            </h6>
            {state.to}
          </div>
          <label htmlFor="title" className="mb-2">
            <h6
              style={{
                fontSize: "1.4rem",
                marginTop: "5px",
                fontWeight: "bolder",
              }}
            >
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
            <a
              className="btn btn-success ml-auto"
              disabled={state.conversation === null}
              onClick={() => {
                if (state.conversation === null) return;
                sendMessage();
              }}
            >
              <FormattedMessage id="src.components.bookingPage.StepTwoContent.send" />
            </a>
          </div>
          <label htmlFor="message" className="mb-2">
            <h6
              style={{
                fontSize: "1.4rem",
                marginTop: "15px",
                fontWeight: "bolder",
              }}
            >
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
        <div className="col-8" style={{marginLeft: 10, marginRight: 10}}>
          <ChatList
            messages={messages}
            onHandleReply={handleReply}
            onHandleRead={setReadStatus}
          />
        </div>
      </div>
    </div>
  );
}

export default Messaging;
