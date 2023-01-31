import {FormattedMessage} from "react-intl";
import {
  StarRating,
  PhysicalRating,
  HorseRating,
  BedRating,
} from "../utils/Ratings";

function RatingTable({announce}) {
  return (
    <div className="table-responsive">
      <table className="table table-borderless" style={{borderTop: "none"}}>
        <tbody>
          <tr>
            <td style={{borderTop: "none", color: "#969696", width: "140px"}}>
              <FormattedMessage id="src.components.rating.Rating.tR1C1" />(
              {announce.numberRatings}){" "}
            </td>
            <td style={{borderTop: "none"}}>
              <StarRating announce={announce} />
            </td>
          </tr>
          {announce.equestrianLevel === 0 ? null : (
            <tr>
              <td style={{borderTop: "none", color: "#969696"}}>
                <FormattedMessage id="src.components.rating.Rating.tR2C1" />
              </td>
              <td style={{borderTop: "none"}}>
                <HorseRating level={announce.equestrianLevel} />
              </td>
            </tr>
          )}
          {announce.physicalLevel === 0 ? null : (
            <tr>
              <td style={{borderTop: "none", color: "#969696"}}>
                <FormattedMessage id="src.components.rating.Rating.tR3C1" />
              </td>
              <td style={{borderTop: "none"}}>
                <PhysicalRating level={announce.physicalLevel} />
              </td>
            </tr>
          )}
          {announce.comfortLevel === 0 ? null : (
            <tr>
              <td style={{borderTop: "none", color: "#969696"}}>
                <FormattedMessage id="src.components.rating.Rating.tR4C1" />
              </td>
              <td style={{borderTop: "none"}}>
                <BedRating level={announce.comfortLevel} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RatingTable;
