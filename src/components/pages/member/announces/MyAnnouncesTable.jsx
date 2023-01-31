import {FormattedMessage, useIntl} from "react-intl";
import {getMuiThemes} from "../../common/mui/MuiThemes.js";
import DataTable from "./DataTable";

function MyAnnouncesTable({announces, selected, onHandleSaveDelete}) {
  const lang = useIntl().locale;
  const cols = [
    {
      name: "title",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.column1" />
      ),
      align: "center",
    },
    {
      name: "cat",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.column2" />
      ),
      align: "center",
    },
    {
      name: "dest",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.column3" />
      ),
      align: "center",
    },
    {
      name: "type",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.column4" />
      ),
      align: "center",
    },
    {
      name: "days_nights",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.column5" />
      ),
      align: "center",
    },
    {
      name: "dates",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.column6" />
      ),
      align: "center",
    },
    {
      name: "lang",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.column7" />
      ),
      align: "center",
    },
    {
      name: "status",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.column8" />
      ),
      align: "center",
    },
    {
      name: "archived",
      label: (
        <FormattedMessage id="src.components.memberPage.tabs.annonces.MyAnnonces.column9" />
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
  ];
  return (
    <DataTable
      announces={announces}
      selected={selected}
      headCells={cols}
      themes={getMuiThemes("MyAnnouncesTable", lang)}
      onHandleSaveDelete={onHandleSaveDelete}
    />
  );
}

export default MyAnnouncesTable;
