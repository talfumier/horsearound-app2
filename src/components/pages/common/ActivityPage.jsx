import {FormattedMessage, useIntl} from "react-intl";
import {useLocation, Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import Banner from "./Banner.jsx";

let msgs = {};
function ActivityPage() {
  let path = useLocation().pathname;
  let params = [];
  params[1] = path.slice(path.lastIndexOf("/") + 1);
  path = path.slice(0, path.lastIndexOf("/"));
  params[0] = path.slice(path.lastIndexOf("/") + 1);
  msgs = useIntl().messages;
  const keys = Object.keys(msgs).filter((key) =>
    key.startsWith(`src.pages.Activites.${params[1]}.`)
  );
  function getParagraph(key) {
    function getListItems(key) {
      let ky = null;
      const sub = key.slice(0, key.length - 1);
      if (typeof msgs[sub + "1"] === "undefined") return null;
      return (
        <ul key={key} style={{marginLeft: 20, marginTop: 0}}>
          {["1", "2", "3", "4", "5"].map((item, idx) => {
            ky = sub + item;
            if (typeof msgs[ky] !== "undefined")
              return (
                <li key={ky + idx} style={{listStyleType: "disc"}}>
                  {<FormattedMessage id={ky} />}
                </li>
              );
          })}
        </ul>
      );
    }
    const cs = key.slice(key.lastIndexOf(".") + 1);
    switch (cs) {
      case "title":
        if (key === keys[0]) break;
        return (
          <h4 key={key} style={{marginTop: "20px", marginBottom: "5px"}}>
            <FormattedMessage id={key} />
          </h4>
        );
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
        break;
      case "0": //[content, item1,item2 .]
        return (
          <div key={key} className="text-justify" style={{marginTop: "0px"}}>
            <FormattedMessage id={key} />
            {getListItems(key)}
          </div>
        );
      default: //xxxParagraph
        return (
          <p key={key} className="text-justify">
            <FormattedMessage id={key} />
          </p>
        );
    }
  }
  return (
    <div>
      <FormattedMessage id={`metaData.activities.${params[1]}.title`}>
        {(text) => (
          <Helmet>
            <title>{text}</title>
          </Helmet>
        )}
      </FormattedMessage>
      <FormattedMessage id={`metaData.activities.${params[1]}.description`}>
        {(text) => (
          <Helmet>
            <meta name="description" content={text} />
          </Helmet>
        )}
      </FormattedMessage>
      <Banner
        title={
          <FormattedMessage id={`metaData.activities.${params[1]}.title`} />
        }
      ></Banner>
      <div
        className="container"
        style={{marginTop: "25px", marginBottom: "50px"}}
      >
        <h3
          style={{
            marginTop: "25px",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          <FormattedMessage
            id={keys[0]} //title
          />
        </h3>
        {keys.map((key) => {
          return getParagraph(key);
        })}
      </div>
      <div className="d-flex justify-content-center">
        <Link
          className="mx-auto"
          style={{color: "black"}}
          to={`/announces?activities=${params[0]}&subactivities=${params[1]}`}
        >
          <div className={"btn btn-success mb-5"}>
            <FormattedMessage id="src.pages.Activites.button" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ActivityPage;
