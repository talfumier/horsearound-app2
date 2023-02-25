import {useIntl} from "react-intl";
import {HorseRating, PhysicalRating} from "../../utils/Ratings";
import LevelInfo from "./common/LevelInfo";
import {range} from "../../utils/utilityFunctions";
import StandardInfo from "./common/StandardInfo";

function EquestrianPhysicalInfo({announce, full}) {
  const lang = useIntl().locale;
  return (
    <div
      className="media d-block p-4"
      style={{
        background: "#f5f5f5",
        borderRadius: "5px",
      }}
    >
      <div className="d-flex col-8 justify-content-left mt-2 ">
        <LevelInfo
          label="src.components.announcePage.announceDetailTab.labels.requiredEquestrianLevel"
          l0="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.header2"
          l1_title="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.span"
          l1_desc="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.description"
          range={[...range(6, 10)]}
          rating={<HorseRating level={announce.equestrianLevel} />}
        ></LevelInfo>
        <LevelInfo
          label="src.components.announcePage.announceDetailTab.labels.physicalLevel"
          l0="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.header3"
          l1_title="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.span"
          l1_desc="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.description"
          range={[...range(11, 15)]}
          rating={<PhysicalRating level={announce.physicalLevel} />}
        ></LevelInfo>
      </div>
      {full && (
        <div className="ml-4">
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
        </div>
      )}
    </div>
  );
}

export default EquestrianPhysicalInfo;
