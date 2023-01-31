import {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useIntl} from "react-intl";
import _ from "lodash";
import ContainerToast from "../common/toastSwal/ContainerToast.jsx";
import PageContent from "./PageContent";
import {getComments} from "../../../services/httpAnnounces.js";
import {errorHandlingToast} from "../../../services/utilsFunctions.js";

function AnnouncePage({announces}) {
  const {locale} = useIntl();
  const location = useLocation();
  const images = location.state !== null ? location.state.images : null;
  const [state, setState] = useState({});
  useEffect(() => {
    async function loadData(signal) {
      const uRLSearch = new URLSearchParams(window.location.search);
      let queryParams = [];
      for (let item of uRLSearch) {
        queryParams.push(item);
      }
      queryParams = queryParams[0][1];
      const announce = _.filter(announces.data, (ann) => {
        return (
          ann._id ===
          (location.state && typeof location.state.id !== "undefined"
            ? location.state.id
            : queryParams)
        );
      })[0];
      let user_comments = [];
      const res = await getComments(announce._id, signal);
      if (!(await errorHandlingToast(res, locale, false)))
        user_comments = res.data;
      setState({announce, user_comments});
    }
    const abortController = new AbortController();
    loadData(abortController.signal);
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, []);
  return (
    Object.keys(state).length === 2 && (
      <>
        <ContainerToast></ContainerToast>
        <PageContent
          announce={state.announce}
          images={images}
          comments={state.user_comments}
        />
      </>
    )
  );
}
export default AnnouncePage;
