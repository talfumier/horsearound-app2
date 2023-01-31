import _ from "lodash";
import {FormattedMessage, useIntl} from "react-intl";
import DataTable from "./DataTable";
import {getMuiThemes} from "../../../common/mui/MuiThemes";

function PriceDatesTable({announce, onHandleFormBooking}) {
  const lang = useIntl().locale;
  const cols = [
    {
      name: announce.datesType === "Fixed_Fixed" ? "departure" : "from",
      label:
        announce.datesType === "Fixed_Fixed" ? (
          <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.departure" />
        ) : (
          <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.from" />
        ),
      align: "center",
    },
    {
      name: announce.datesType === "Fixed_Fixed" ? "return" : "to",
      label:
        announce.datesType === "Fixed_Fixed" ? (
          <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.return" />
        ) : (
          <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.to" />
        ),
      align: "center",
    },
    {
      name: "comment",
      label: (
        <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.comments" />
      ),
      align: "left",
    },
    {
      name: "price",
      label:
        announce.datesType !== "Flex_Flex" ? (
          <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.price" />
        ) : (
          <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.priceDay" />
        ),
      align: "left",
    },
    {
      name: "promo",
      label: (
        <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.promo" />
      ),
      align: "left",
    },
    {
      name: "id",
      label: "id",
      hidden: true,
    },
  ];
  if (
    announce.datesType === "Fixed_Fixed" ||
    announce.datesType === "Flex_Fixed"
  ) {
    cols.splice(2, 0, {
      name: "duration",
      label: (
        <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.duration" />
      ),
      align: "center",
    });
    if (announce.datesType === "Fixed_Fixed")
      cols.splice(
        3,
        0,
        {
          name: "peopleCapacity",
          label: (
            <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.peopleCapacity" />
          ),
          align: "center",
        },
        {
          name: "status",
          label: (
            <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.status" />
          ),
          align: "left",
        }
      );
  }
  return (
    <div>
      <DataTable
        announce={announce}
        headCells={cols}
        themes={getMuiThemes("PriceDatesTable", lang)}
        onHandleFormBooking={onHandleFormBooking}
      />
    </div>
  );
}

export default PriceDatesTable;
