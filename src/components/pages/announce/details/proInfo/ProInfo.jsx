import {parseISO, format, differenceInDays} from "date-fns";
import StandardInfo from "../common/StandardInfo";
import AnnounceRatings from "./AnnounceRatings";
import AnnounceComments from "./comments/AnnounceComments";

function ProInfo({bookings, announce, comments}) {
  function getBookingDays() {
    let days = 0;
    bookings.map((booking) => {
      days +=
        differenceInDays(
          parseISO(booking.date.dateEnd),
          parseISO(booking.date.dateStart)
        ) *
        (booking.children.nb + booking.adults.nb);
    });
    return days;
  }
  const levels = {
    1: announce.environmentLandscapeNote,
    2: announce.cavalryNote,
    3: announce.horseAroundNote,
    4: announce.receptionNote,
    5: announce.qualityPriceNote,
  };
  return (
    <div
      className="media d-block pt-4 pl-4 "
      style={{
        background: "#f5f5f5",
        borderRadius: "5px",
      }}
    >
      <div className="row ml-0 mt-0 mb-1 ">
        <div className="col-md-4 pl-4 mt-3 mb-1 w-100">
          <StandardInfo
            field={format(
              parseISO(announce.id_user.registration_date),
              "dd.MM.yyyy"
            )}
            lang={null}
            id="src.components.announcePage.moreInfos.registeredSince"
          ></StandardInfo>
        </div>
        <div className="col-md-4 pl-4 mt-3 mb-1 w-100">
          <StandardInfo
            className="col-md-4 pl-4 mt-3 mb-1 w-100"
            field={getBookingDays().toString()}
            lang={null}
            id="src.components.announcePage.moreInfos.nbSoldDays"
          ></StandardInfo>
        </div>
        <div className="col-md-4 pl-4 mt-3 mb-1 w-100">
          <StandardInfo
            className="col-md-4 pl-4 mt-3 mb-1 w-100"
            field={bookings.length.toString()}
            lang={null}
            id="src.components.announcePage.moreInfos.nbBookings"
          ></StandardInfo>
        </div>
      </div>
      <AnnounceRatings
        label="src.components.rating.DetailledRating.title"
        levels={levels}
      ></AnnounceRatings>
      <AnnounceComments
        announce_id={announce._id}
        bookings={bookings}
        data={comments}
      ></AnnounceComments>
    </div>
  );
}

export default ProInfo;
