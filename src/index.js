import ReactDOM from "react-dom";
//import {createRoot} from "react-dom/client";
import {QueryClient, QueryClientProvider} from "react-query";
import {CookiesProvider} from "react-cookie";
import "./index.css";
import IntlProviderWrapper from "./components/intl/IntlProviderWrapper";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient();
ReactDOM.render(
  //<React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <CookiesProvider>
      <IntlProviderWrapper>
        <App />
      </IntlProviderWrapper>
    </CookiesProvider>
  </QueryClientProvider>,
  //</React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();

/* const queryClient = new QueryClient();
const app = document.getElementById("root");
const root = createRoot(app); // create a root
//render app to root
root.render(
  //<React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <CookiesProvider>
      <IntlProviderWrapper>
        <App />
      </IntlProviderWrapper>
    </CookiesProvider>
  </QueryClientProvider>
  //</React.StrictMode>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); */
