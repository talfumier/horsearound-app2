import {FormattedMessage, useIntl} from "react-intl";
import {getMuiThemes} from "../../common/mui/MuiThemes.js";
import DataTable from "./dataTable/DataTable.jsx";

function MyInvoicesTable({invoices, spinner, onHandleInvoiceChange}) {
  const {locale} = useIntl();
  const cols = [
    {
      name: "reference",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.column0" />
      ),
      align: "center",
    },
    {
      name: "period",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.column2" />
      ),
      align: "center",
    },
    {
      name: "announce_bookings",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.column1" />
      ),
      align: "center",
    },
    {
      name: "amount",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.column3" />
      ),
      align: "center",
    },
    {
      name: "deadline",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.column4" />
      ),
      align: "center",
    },
    {
      name: "steps_completed",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.ColumnStepsComplete" />
      ),
      align: "left",
    },
    {
      name: "steps_todo",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.ColumnStepsToDo" />
      ),
      align: "center",
    },
    {
      name: "cancel",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.ColumnCancel" />
      ),
      align: "center",
    },
    {
      name: "id",
      label: "id",
      hidden: true,
    },
  ];

  return (
    <DataTable
      invoices={invoices}
      headCells={cols}
      themes={getMuiThemes("MyInvoicesTable", locale)}
      spinner={spinner}
      onHandleInvoiceChange={onHandleInvoiceChange}
    />
  );
}

export default MyInvoicesTable;
