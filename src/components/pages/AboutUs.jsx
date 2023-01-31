import {FormattedMessage} from "react-intl";
import Banner from "./common/Banner";
import Meta from "./common/Meta";

function AboutUs() {
  return (
    <div>
      <Meta id="aboutUs"></Meta>
      <Banner title={<FormattedMessage id="src.pages.AboutUs.title" />} />
      <div
        className="container"
        style={{marginTop: "25px", marginBottom: "50px"}}
      >
        <br />
        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.AboutUs.firstTitle" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.AboutUs.firstParagraph.content" />
        </p>
        <p className="text-justify">
          •{" "}
          <FormattedMessage id="src.pages.AboutUs.firstParagraph.firstPoint" />
        </p>
        <p className="text-justify">
          •{" "}
          <FormattedMessage id="src.pages.AboutUs.firstParagraph.secondPoint" />
        </p>
        <p className="text-justify">
          •{" "}
          <FormattedMessage id="src.pages.AboutUs.firstParagraph.thirdPoint" />
        </p>
        <p className="text-justify">
          •{" "}
          <FormattedMessage id="src.pages.AboutUs.firstParagraph.fourthPoint" />
        </p>
        <p className="text-justify">
          <FormattedMessage id="src.pages.AboutUs.firstParagraph.fifthPoint" />
        </p>
        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.AboutUs.secondTitle" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.AboutUs.description" />
        </p>
        <table className="table table-bordered">
          <tbody>
            <tr style={{backgroundColor: "#e9ecef"}}>
              <td>
                <FormattedMessage id="src.pages.AboutUs.table.firstTitle" />
              </td>
              <td colSpan={2}>
                <FormattedMessage id="src.pages.AboutUs.table.secondTitle" />
              </td>
            </tr>
            <tr>
              <td>
                <FormattedMessage id="src.pages.AboutUs.table.firstSubContent.title" />
              </td>
              <td>
                <FormattedMessage id="src.pages.AboutUs.table.firstSubContent.firstSubDescription" />
              </td>
              <td>
                <FormattedMessage id="src.pages.AboutUs.table.firstSubContent.secondSubDescription" />
              </td>
            </tr>
            <tr>
              <td>
                <FormattedMessage id="src.pages.AboutUs.table.secondSubContent.title" />
              </td>
              <td>
                <FormattedMessage id="src.pages.AboutUs.table.secondSubContent.firstSubDescription" />
              </td>
              <td>
                <FormattedMessage id="src.pages.AboutUs.table.secondSubContent.secondSubDescription" />
              </td>
            </tr>
            <tr>
              <td>
                <FormattedMessage id="src.pages.AboutUs.table.thirdSubContent.title" />
              </td>
              <td>
                <FormattedMessage id="src.pages.AboutUs.table.thirdSubContent.firstSubDescription" />
              </td>
              <td>
                <FormattedMessage id="src.pages.AboutUs.table.thirdSubContent.secondSubDescription" />
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-justify">
          <FormattedMessage id="src.pages.AboutUs.table.subDescription1" />
        </p>
        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.AboutUs.table.secondParagraph.title" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.AboutUs.table.secondParagraph.content" />
        </p>
        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.AboutUs.thirdParagraph.title" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.AboutUs.thirdParagraph.content.description" />
        </p>
        <p className="text-justify">
          •{" "}
          <FormattedMessage id="src.pages.AboutUs.thirdParagraph.content.firstPoint" />{" "}
        </p>
        <p className="text-justify">
          •{" "}
          <FormattedMessage id="src.pages.AboutUs.thirdParagraph.content.secondPoint" />
        </p>
        <p className="text-justify">
          •{" "}
          <FormattedMessage id="src.pages.AboutUs.thirdParagraph.content.thirdPoint" />
        </p>

        <p className="text-justify">
          <FormattedMessage id="src.pages.AboutUs.thirdParagraph.content1" />
        </p>
        <h3 style={{marginTop: "25px"}}>
          <FormattedMessage id="src.pages.AboutUs.fourthParagraph.title" />
        </h3>
        <p className="text-justify">
          <FormattedMessage id="src.pages.AboutUs.fourthParagraph.content" />
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
