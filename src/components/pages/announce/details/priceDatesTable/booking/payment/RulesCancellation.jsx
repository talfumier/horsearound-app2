import {FormattedMessage} from "react-intl";

function RulesCancellation() {
  const listStyle = {
    listStyleType: "disc",
  };
  return (
    <div>
      <div
        className=""
        style={{
          //backgroundColor: "#7AA095 ",
          width: "100%",
          borderRadius: "30px",
        }}
      >
        <div
          className="p-5"
          style={{
            height: "100%",
          }}
        >
          <div
            className="p-2 text-justify row"
            style={{
              fontFamily: "Montserrat",
              color: "black",
            }}
          >
            <i className="fa fa-info-circle p-2" style={{color: "white"}} />
            <h2>
              <FormattedMessage id="src.components.bookingPage.StepProgress.title1" />
            </h2>
          </div>

          <h3>
            <FormattedMessage id="src.components.bookingPage.StepProgress.subtitle1" />
          </h3>
          <div className="text-dark text-justify">
            <FormattedMessage id="src.components.bookingPage.StepProgress.firstParagraph" />
          </div>
          <div className="text-dark text-justify">
            <FormattedMessage id="src.components.bookingPage.StepProgress.secondParagraph" />
          </div>
          <h3>
            <FormattedMessage id="src.components.bookingPage.StepProgress.subtitle2" />
          </h3>
          <div className="text-dark text-justify">
            <FormattedMessage id="src.components.bookingPage.StepProgress.thirdParagraph" />
          </div>
          <h4>
            <FormattedMessage id="src.components.bookingPage.StepProgress.subtitle3" />
          </h4>
          <div className="text-dark text-justify">
            <FormattedMessage id="src.components.bookingPage.StepProgress.fourthParagraph" />
            <ul className="pl-5">
              <li style={listStyle}>
                <FormattedMessage id="src.components.bookingPage.StepProgress.list1.point1" />
              </li>
              <li style={listStyle}>
                <FormattedMessage id="src.components.bookingPage.StepProgress.list1.point2" />
              </li>
              <li style={listStyle}>
                <FormattedMessage id="src.components.bookingPage.StepProgress.list1.point3" />
              </li>
              <li style={listStyle}>
                <FormattedMessage id="src.components.bookingPage.StepProgress.list1.point4" />
              </li>
            </ul>
            <FormattedMessage id="src.components.bookingPage.StepProgress.fifthParagraph" />
          </div>
          <h4>
            <FormattedMessage id="src.components.bookingPage.StepProgress.subtitle4" />
          </h4>
          <div className="text-dark text-justify">
            <FormattedMessage id="src.components.bookingPage.StepProgress.sixthParagraph" />
            <ul className="pl-5">
              <li style={listStyle}>
                <FormattedMessage id="src.components.bookingPage.StepProgress.list2.point1" />
              </li>
              <li style={listStyle}>
                <FormattedMessage id="src.components.bookingPage.StepProgress.list2.point2" />
              </li>
              <ul className="pl-5">
                <li style={listStyle}>
                  <FormattedMessage id="src.components.bookingPage.StepProgress.list2.point3.subpoint1" />
                </li>
                <li style={listStyle}>
                  <FormattedMessage id="src.components.bookingPage.StepProgress.list2.point3.subpoint2" />
                </li>
                <li style={listStyle}>
                  <FormattedMessage id="src.components.bookingPage.StepProgress.list2.point3.subpoint3" />
                </li>
              </ul>
            </ul>
            <FormattedMessage id="src.components.bookingPage.StepProgress.seventhParagraph" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RulesCancellation;
