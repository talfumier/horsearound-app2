import {FormattedMessage} from "react-intl";
import Banner from "./common/Banner";
import Meta from "./common/Meta";

function LegalNotice() {
  return (
    <div>
      <Meta id="legalNotices"></Meta>
      <Banner
        title={<FormattedMessage id="src.pages.MentionsLegales.title" />}
      />
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
          <FormattedMessage id="src.pages.MentionsLegales.subTitle" />
        </h1>
        <p className="text-justify">
          <FormattedMessage id="src.pages.MentionsLegales.firstParagraph" />
        </p>
        <p className="text-justify">
          <FormattedMessage id="src.pages.MentionsLegales.secondParagraph" />
        </p>
        <p className="text-justify">
          <FormattedMessage id="src.pages.MentionsLegales.thirdParagraph" />
        </p>

        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.MentionsLegales.article1.title" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.MentionsLegales.article1.description" />
        </p>
        <h4 style={{marginTop: "25px"}}>
          {" "}
          <FormattedMessage id="src.pages.MentionsLegales.article1.item1.title" />
        </h4>
        <p className="text-justify">
          <FormattedMessage id="src.pages.MentionsLegales.article1.item1.content" />
        </p>
        <h4 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.MentionsLegales.article1.item2.title" />{" "}
        </h4>
        <p className="text-justify">
          <FormattedMessage id="src.pages.MentionsLegales.article1.item2.content" />
        </p>
        <h4 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.MentionsLegales.article1.item3.title" />{" "}
        </h4>
        <p className="text-justify">
          <FormattedMessage id="src.pages.MentionsLegales.article1.item3.content" />
        </p>
        <h4 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.MentionsLegales.article1.item4.title" />{" "}
        </h4>
        <p className="text-justify">
          <FormattedMessage id="src.pages.MentionsLegales.article1.item4.content" />
        </p>
        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.MentionsLegales.article2.title" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.MentionsLegales.article2.content" />
        </p>
      </div>
    </div>
  );
}

export default LegalNotice;
