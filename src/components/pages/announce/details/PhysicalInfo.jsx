import {PhysicalRating} from "../../utils/Ratings";
import LevelInfo from "./common/LevelInfo";
import {range} from "../../utils/utilityFunctions";

function PhysicalInfo({announce}) {
  return (
    <div
      className="media d-block p-4"
      style={{
        background: "#f5f5f5",
        borderRadius: "5px",
      }}
    >
      <LevelInfo
        label="src.components.announcePage.announceDetailTab.labels.physicalLevel"
        l0="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.header3"
        l1_title="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.span"
        l1_desc="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.description"
        range={[...range(11, 15)]}
        rating={<PhysicalRating level={announce.physicalLevel} />}
      ></LevelInfo>
    </div>
  );
}

export default PhysicalInfo;
