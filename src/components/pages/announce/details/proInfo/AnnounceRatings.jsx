import React from "react";
import {FormattedMessage} from "react-intl";
import {StarRatingLevel} from "../../../utils/Ratings";

function AnnounceRatings({label, levels}) {
  return (
    <>
      <div className="row ml-0 mt-0 mb-1 pt-1">
        <h5 className="media-heading mt-0 ml-4 font-weight-bold">
          <FormattedMessage id={label} />
        </h5>
      </div>
      <div className="row  m-4 mt-0">
        {Object.keys(levels).map((idx) => {
          return (
            <React.Fragment key={idx}>
              <h5 className="media-heading pl-4 pr-4 font-weight-bold">
                <FormattedMessage id={`${label}${idx}`} />
              </h5>
              <StarRatingLevel key={idx} level={levels[idx]} />
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}

export default AnnounceRatings;
