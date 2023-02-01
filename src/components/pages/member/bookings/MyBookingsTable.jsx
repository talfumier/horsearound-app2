import {FormattedMessage, useIntl} from "react-intl";
import {getMuiThemes} from "../../common/mui/MuiThemes.js";
import DataTable from "./dataTable/DataTable.jsx";

function MyBookingsTable({bookings, selected, spinner, onHandleBookingChange}) {
  const {locale} = useIntl();
  const cols = [
    {
      name: "reference-booked by",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnRef" />
      ),
      align: "center",
    },
    {
      name: "activity-organizer",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnTitle" />
      ),
      align: "center",
    },
    {
      name: "date",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnDate" />
      ),
      align: "center",
    },
    {
      name: "days-nights",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnDaysNights" />
      ),
      align: "center",
    },
    {
      name: "participants",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnNumber" />
      ),
      align: "center",
    },
    {
      name: "options",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnOption" />
      ),
      align: "center",
    },
    {
      name: "price",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnPrice" />
      ),
      align: "center",
    },
    /* {
      name: "peopleCapacity",
      label: (
        <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.peopleCapacity" />
      ),
      align: "center",
    }, */
    {
      name: "steps_completed",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnStepsComplete" />
      ),
      align: "left",
    },
    {
      name: "steps_todo",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnStepsToDo" />
      ),
      align: "center",
    },
    {
      name: "cancel",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.MyReservation.rColumnCancel" />
      ),
      align: "center",
    },
    {
      name: "id",
      label: "id",
      hidden: true,
    },
    {
      name: "user_id",
      label: "user_id",
      hidden: true,
    },
    {
      name: "announce_id",
      label: "announce_id",
      hidden: true,
    },
  ];

  return (
    <DataTable
      bookings={bookings}
      selected={selected}
      headCells={cols}
      themes={getMuiThemes("MyBookingsTable", locale)}
      spinner={spinner}
      onHandleBookingChange={onHandleBookingChange}
    />
  );
}

export default MyBookingsTable;
