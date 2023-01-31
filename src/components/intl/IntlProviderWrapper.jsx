import {useState, useContext} from "react";
import {IntlProvider} from "react-intl";
import messages from "./translations.json";
import langs from "./languages.json";
import {flattenMessages} from "./messagesActions";
import IntlContext from "./IntlContext";

export default function IntlProviderWrapper({children}) {
  const browser_lang = window.navigator.language;
  const lang = langs.french.includes(browser_lang) ? "fr" : "en";
  const lang_messages = langs.french.includes(browser_lang) ? "fr-FR" : "en-EN";
  function switchToFrench(images) {
    try {
      document.getElementById("filterReset").click(); //reset filter before language switching
    } catch (error) {}
    setState({
      ...state,
      locale: "fr",
      messages: flattenMessages(messages["fr-FR"]),
      images,
    });
  }
  function switchToEnglish(images) {
    try {
      document.getElementById("filterReset").click(); //reset filter before language switching
    } catch (error) {}
    setState({
      ...state,
      locale: "en",
      messages: flattenMessages(messages["en-EN"]),
      images,
    });
  }
  const [state, setState] = useState({
    locale: lang,
    messages: flattenMessages(messages[lang_messages]),
    functions: {
      switchToFrench,
      switchToEnglish,
    },
  });
  return (
    <IntlContext.Provider value={state.functions}>
      <IntlProvider
        locale={state.locale}
        messages={state.messages}
        formats={state.images} //IntlProvider formats property used to pass images data
      >
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  );
}
