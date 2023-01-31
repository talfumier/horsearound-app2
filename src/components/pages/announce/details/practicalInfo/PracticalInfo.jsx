import {useIntl, FormattedMessage} from "react-intl";
import LangLevelInfo from "./LangLevelInfo";
import {range} from "../../../utils/utilityFunctions";
import france from "../../../../intl/flags/france.png";
import uk from "../../../../intl/flags/uk.png";
import germany from "../../../../intl/flags/germany.png";
import spain from "../../../../intl/flags/spain.png";
import StandardInfoMulti from "../common/StandardInfoMulti";
import StandardInfo from "../common/StandardInfo";

function PracticalInfo({announce}) {
  const intl = useIntl();
  const lang = intl.locale;
  function getLangLevels() {
    const levelNames = [
        "frenchLevel",
        "englishLevel",
        "germanLevel",
        "spanishLevel",
      ],
      imgs = [france, uk, germany, spain],
      levels = {};
    levelNames.map((name, idx) => {
      if (announce[name])
        levels[name] = {level: announce[name], img: imgs[idx]};
    });
    return levels;
  }
  function getParticipantsData(min, max, id) {
    const data = {},
      paragraphs = [];
    let cs = 0;
    if (min) {
      paragraphs.push(`min : ${min}`);
      cs = 1;
    }
    if (max) {
      paragraphs.push(`max : ${max}`);
      cs = 1;
    }
    if (cs === 0) return null;
    data.title = intl.formatMessage({
      id: id,
    });
    data.paragraphs = paragraphs;
    return data;
  }
  function getChildUnderAgeData(childUnder, ids) {
    const data = {},
      paragraphs = [];
    let cs = 0;
    if (childUnder) {
      data.title = intl.formatMessage({
        id: ids[0],
      });
      paragraphs.push(
        `${intl.formatMessage({
          id: ids[1],
        })} ${childUnder} ${intl.formatMessage({
          id: ids[2],
        })}`
      );
      data.paragraphs = paragraphs;
      cs = 1;
    }
    if (cs === 0) return null;
    return data;
  }
  function getParticipantsData(min, max, id) {
    const data = {},
      paragraphs = [];
    let cs = 0;
    if (min) {
      paragraphs.push(`min : ${min}`);
      cs = 1;
    }
    if (max) {
      paragraphs.push(`max : ${max}`);
      cs = 1;
    }
    if (cs === 0) return null;
    data.title = intl.formatMessage({
      id: id,
    });
    data.paragraphs = paragraphs;
    return data;
  }
  return (
    <div
      className="media d-block p-4"
      style={{
        background: "#f5f5f5",
        borderRadius: "5px",
      }}
    >
      <LangLevelInfo
        label="src.components.announcePage.announceDetailTab.labels.languages"
        l0="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.header5"
        l1_title="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.span"
        l1_desc="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.description"
        range={[...range(20, 24)]}
        levels={getLangLevels()}
      ></LangLevelInfo>
      <div className="row mb-1 ">
        <StandardInfoMulti
          data={getParticipantsData(
            announce.participantMin,
            announce.participantMax,
            "src.components.announcePage.announceDetailTab.labels.nbParticipants"
          )}
        ></StandardInfoMulti>
        <StandardInfoMulti
          data={getParticipantsData(
            announce.ageMinParticipant,
            announce.ageMaxParticipant,
            "src.components.announcePage.announceDetailTab.labels.age"
          )}
        ></StandardInfoMulti>
        <StandardInfoMulti
          data={getChildUnderAgeData(announce.childUnderOf, [
            "src.components.announcePage.announceDetailTab.labels.childrenAccompanying",
            "src.components.announcePage.announceDetailTab.labels.childrenUnderAge",
            "src.components.announcePage.announceDetailTab.labels.shouldBeAccompagned",
          ])}
        ></StandardInfoMulti>
        <div className="pl-4">
          <StandardInfo
            field={announce.howToGoTo}
            lang={lang}
            id="src.components.announcePage.announceDetailTab.labels.howTo"
            className="ml-4"
          ></StandardInfo>
          <StandardInfo
            field={announce.infosAdditional}
            lang={lang}
            id="src.components.announcePage.announceDetailTab.labels.additionalInfos"
            className="ml-4"
          ></StandardInfo>
        </div>
      </div>
    </div>
  );
}

export default PracticalInfo;
