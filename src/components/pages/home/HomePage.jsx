import {useEffect, useContext} from "react";
import {useIntl} from "react-intl";
import {useCookies} from "react-cookie";
import {decodeJWT} from "../../../services/httpUsers.js";
import {setLoginTimeOut, handleLogOut} from "../logIn&Out/FormLogin.jsx";
import PageContent from "./PageContent";
import UserContext from "../common/context/UserContext.js";

let flg = -1; //indicates 1st visit on the home page
function HomePage({announces}) {
  const userContext = useContext(UserContext);
  const {locale, formatMessage} = useIntl();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  useEffect(() => {
    //when user comes back and re-open the site (flg=-1), reset login timeout if
    //cookies.user still present and with sufficient remaining time before expiry (at least 5 mn left)
    if (cookies.user && userContext && flg === -1) {
      const {exp, _id} = decodeJWT(cookies.user); //exp in seconds since EPOCH
      if (exp * 1000 - Date.now() - 300 * 1000 >= 300 * 1000)
        setLoginTimeOut(
          formatMessage,
          setCookie,
          removeCookie,
          null, //navigate=null
          exp,
          userContext,
          _id,
          cookies.user,
          locale
        );
      else handleLogOut(removeCookie, null, userContext); //navigate=null
      flg += 1;
    }
  }, [userContext]);
  return <PageContent announces={announces} />;
}

export default HomePage;
