import {FormattedMessage} from "react-intl";
import Banner from "./common/Banner";
import Meta from "./common/Meta";

function Support(props) {
  return (
    <div>
      <Meta id="support"></Meta>
      <Banner title={<FormattedMessage id="src.pages.Support.title" />} />
      <div
        className="container"
        style={{marginTop: "25px", marginBottom: "50px"}}
      >
        <br />
        <h1
          style={{
            marginTop: "25px",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          <FormattedMessage id="src.pages.Support.title" />
        </h1>
        <p className="text-justify">
          <FormattedMessage id="src.pages.Support.firstParagraph" />
        </p>
        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.Support.secondParagraph.title" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.Support.secondParagraph.content" />
        </p>
        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.Support.thirdParagraph.title" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.Support.thirdParagraph.content" />
        </p>
        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.Support.fourthParagraph.title" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.Support.fourthParagraph.content" />
        </p>
        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.Support.fifthParagraph.title" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.Support.fifthParagraph.content" />
        </p>
      </div>
    </div>
  );
}

export default Support;
