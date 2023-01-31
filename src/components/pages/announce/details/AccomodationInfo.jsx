import {useIntl} from "react-intl";
import {BedRating} from "../../utils/Ratings";
import LevelInfo from "./common/LevelInfo";
import {range} from "../../utils/utilityFunctions";
import StandardInfo from "./common/StandardInfo";

function AccomodationInfo({announce}) {
  const lang = useIntl().locale;
  return (
    <div
      className="media d-block p-4"
      style={{
        background: "#f5f5f5",
        borderRadius: "5px",
      }}
    >
      <LevelInfo
        label="src.components.announcePage.announceDetailTab.labels.accommodation"
        l0="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.header1"
        l1_title="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.span"
        l1_desc="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.description"
        range={[...range(1, 5)]}
        rating={<BedRating level={announce.comfortLevel} />}
      ></LevelInfo>
      <StandardInfo
        field={announce.accommodationDescription}
        lang={lang}
        id="src.components.announcePage.announceDetailTab.labels.houseFood"
      ></StandardInfo>
      <StandardInfo
        field={announce.mealDescription}
        lang={lang}
        id="src.components.announcePage.announceDetailTab.labels.meal"
      ></StandardInfo>
    </div>
  );
}

export default AccomodationInfo;
