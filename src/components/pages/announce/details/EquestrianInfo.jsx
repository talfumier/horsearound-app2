import {useIntl} from "react-intl";
import {HorseRating} from "../../utils/Ratings";
import LevelInfo from "./common/LevelInfo";
import {range} from "../../utils/utilityFunctions";
import StandardInfo from "./common/StandardInfo";

function EquestrianInfo({announce, full}) {
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
        label="src.components.announcePage.announceDetailTab.labels.requiredEquestrianLevel"
        l0="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.header2"
        l1_title="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.span"
        l1_desc="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.description"
        range={[...range(6, 10)]}
        rating={<HorseRating level={announce.equestrianLevel} />}
      ></LevelInfo>
      {full && (
        <>
          <StandardInfo
            field={announce.horseDescription}
            lang={lang}
            id="src.components.announcePage.announceDetailTab.labels.horses"
          ></StandardInfo>
          <StandardInfo
            field={announce.saddleryDescription}
            lang={lang}
            id="src.components.announcePage.announceDetailTab.labels.saddlery"
          ></StandardInfo>
        </>
      )}
    </div>
  );
}

export default EquestrianInfo;
