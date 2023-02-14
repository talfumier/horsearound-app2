import {useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import classnames from "classnames";
import {TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap";
import MyInvoicesTable from "./MyInvoicesTable.jsx";
import MyConditions from "./MyConditions.jsx";
import "./navlink.css";

function MyInvoices({
  invoices,
  spinner,
  onHandleInvoiceChange,
  onHandleConditionsChange,
  onHandleSummary,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [padding, setPadding] = useState(null);
  useEffect(() => {
    function setPad() {
      let ni = 0,
        np = 0;
      Object.keys(invoices).map((key) => {
        ni += invoices[key].nbInvoices;
        np += invoices[key].nbPending;
      });
      if (
        ni === 0 ||
        (document.getElementById("paidInvoiceSlider").checked && np === 0)
      )
        setPadding("4%");
      else setPadding(0);
    }
    document
      .getElementById("paidInvoiceSlider")
      .addEventListener("change", setPad);
    return () => {
      try {
        document
          .getElementById("paidInvoiceSlider")
          .removeEventListener("change", setPad);
      } catch {}
    };
  }, []);
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
      <TabContent
        activeTab={activeTab}
        style={{paddingTop: padding, width: "100%"}}
      >
        <TabPane
          tabId={0}
          style={{
            backgroundColor: "#F2F2F2",
          }}
        >
          <MyInvoicesTable
            invoices={invoices}
            spinner={spinner}
            onHandleInvoiceChange={onHandleInvoiceChange}
          ></MyInvoicesTable>
        </TabPane>
        <TabPane
          tabId={1}
          style={{
            backgroundColor: "#F2F2F2",
            overflowY: "auto",
            height: 550,
            marginBottom: 10,
          }}
        >
          <MyConditions
            data={invoices}
            onHandleSummary={onHandleSummary}
            onHandleConditionsChange={onHandleConditionsChange}
          ></MyConditions>
        </TabPane>
      </TabContent>
    </div>
  );
}

export default MyInvoices;
