import {useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import classnames from "classnames";
import {Card} from "@mui/material";
import {TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap";
import MyInvoicesTable from "./MyInvoicesTable.jsx";
import "./navlink.css";

function MyInvoices({invoices, spinner, onHandleInvoiceChange}) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="profile-header-tab nav nav-tabs p-0 m-0 pt-2">
      <Nav>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === 0,
              inv: true,
            })}
            onClick={() => {
              setActiveTab(0);
            }}
            style={{cursor: "pointer"}}
          >
            <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.tab0" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === 1,
              inv: true,
            })}
            onClick={() => {
              setActiveTab(1);
            }}
          >
            <FormattedMessage id="src.components.memberPage.tabs.price.MyPrice.tab1" />
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="d-flex m-0 p-0" activeTab={activeTab}>
        <TabPane tabId={0}>
          <MyInvoicesTable
            invoices={invoices}
            spinner={spinner}
            onHandleInvoiceChange={onHandleInvoiceChange}
          ></MyInvoicesTable>
        </TabPane>
      </TabContent>
    </div>
  );
}

export default MyInvoices;
