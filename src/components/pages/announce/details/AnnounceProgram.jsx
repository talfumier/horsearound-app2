import {FormattedMessage, useIntl} from "react-intl";

function AnnounceProgram({announce}) {
  const lang = useIntl().locale;
  return (
    <div className="information-aria m-0 p-4">
      {announce.typicalDay ? (
        typeof announce.typicalDay[lang] !== "undefined" ? (
          <div className="singleContent ">
            <div className="media" style={{padding: "10px 10px 0 10px"}}>
              <div className="media-body">
                <p
                  style={{
                    textAlign: "justify",
                    padding: "2px",
                    marginBottom: "15px",
                  }}
                >
                  <b>
                    {" "}
                    <FormattedMessage id="src.components.announcePage.announceDetailTab.program.typicalDay" />
                  </b>
                </p>
                <p
                  style={{
                    textAlign: "justify",
                    padding: "2px",
                    marginBottom: "15px",
                  }}
                >
                  {announce.typicalDay[lang]}
                </p>
              </div>
            </div>
          </div>
        ) : null
      ) : null}
      {announce.days.length !== 0 &&
      announce.days[0].title &&
      announce.days[0].title[lang] &&
      announce.days[0].title[lang].length > 0
        ? announce.days.map((day, index) => {
            return (
              <div key={index} className="singleContent">
                <div className="media" style={{padding: "10px 10px 0 10px"}}>
                  <div className="media-body">
                    <p
                      style={{
                        textAlign: "justify",
                        padding: "2px",
                        marginBottom: "15px",
                      }}
                    >
                      <b> {day.title[lang] ? day.title[lang] : null}</b>
                    </p>
                    <p
                      style={{
                        textAlign: "justify",
                        padding: "2px",
                        marginBottom: "15px",
                      }}
                    >
                      {day.description[lang] ? day.description[lang] : null}
                    </p>
                    <p
                      style={{
                        textAlign: "justify",
                        padding: "2px",
                        marginBottom: "0px",
                      }}
                    >
                      {day.accommodation[lang] ? (
                        <span>
                          <FormattedMessage id="src.components.announcePage.announceDetailTab.program.accomodation" />
                          <span>{day.accommodation[lang]}</span>
                        </span>
                      ) : null}
                    </p>
                    <p style={{textAlign: "justify", padding: "2px"}}>
                      {day.nbHoursEqui ? (
                        <span>
                          <FormattedMessage id="src.components.announcePage.announceDetailTab.program.nbHoursRiding" />
                          <span>{day.nbHoursEqui}</span>
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <div className="media-right">
                    <div className="days">
                      <FormattedMessage id="src.components.announcePage.announceDetailTab.program.day" />{" "}
                      {index + 1}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        : null}
      {(announce.days.length === 0 ||
        (announce.days[0] && announce.days[0].title[lang].length === 0)) &&
      (!announce.typicalDay ||
        typeof announce.typicalDay[lang] === "undefined" ||
        announce.typicalDay[lang] === "") ? (
        <h5 className="media font-weight-bold">
          <FormattedMessage id="src.components.announcePage.announceDetailTab.program.noInfos" />
        </h5>
      ) : null}
    </div>
  );
}

export default AnnounceProgram;
