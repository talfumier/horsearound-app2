import {useState, useEffect, useContext} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Card} from "@mui/material";
import {TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap";
import FontAwesome from "react-fontawesome";
import classnames from "classnames";
import _ from "lodash";
import BookingRecap from "./BookingRecap";
import ProContext from "../../../../../common/context/ProContext.js";
import {RenderInWindow} from "../../../../../common/RenderInWindow.jsx";
import {toastInfo} from "../../../../../common/toastSwal/ToastMessages.js";
import Rib from "./Rib.jsx";
import Check from "./Check.jsx";

function PaymentTabs({
  announce,
  recap,
  cbPayment1,
  cbPayment2,
  locks,
  onHandleCbPayment,
}) {
  const proContext = useContext(ProContext);
  const {formatMessage} = useIntl();
  const [pro, setPro] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    setPro(proContext.pro[announce.id_user._id]);
  }, []);
  const [open, setOpen] = useState({rib: false, check: false});
  function RibElement({prt = false}) {
    return (
      <Rib
        data={{
          bankCode: pro.bankCode,
          guichetCode: pro.guichetCode,
          numberAccount: pro.numberAccount,
          keyAccount: pro.keyAccount,
          deviseAccount: pro.deviseAccount,
          iban: pro.iban,
          bic: pro.bic,
        }}
        prt={prt}
        cbPayment1={!prt ? cbPayment1 : null}
        locks={locks}
        onHandleOpen={() => {
          if (open.rib) {
            toastInfo(
              formatMessage({
                id: "user_msg.standard.errors.windowOpen",
              })
            );
            return;
          }
          setOpen({...open, rib: !open.rib});
        }}
        onHandleCbPayment={!prt ? onHandleCbPayment : null}
      ></Rib>
    );
  }
  function CheckElement({prt = false}) {
    return (
      <TabContent
        className="p-4"
        activeTab={activeTab}
        style={{
          border: "1px solid rgba(111,111,111,0.2)",
        }}
      >
        <Check
          data={{
            checkOrder: pro.checkOrder,
            checkAdress: pro.checkAdress,
          }}
          prt={prt}
          cbPayment2={!prt ? cbPayment2 : null}
          locks={locks}
          onHandleOpen={() => {
            if (open.check) {
              toastInfo(
                formatMessage({
                  id: "user_msg.standard.errors.windowOpen",
                })
              );
              return;
            }
            setOpen({...open, check: !open.check});
          }}
          onHandleCbPayment={!prt ? onHandleCbPayment : null}
        ></Check>
      </TabContent>
    );
  }
  return (
    pro !== null && (
      <>
        <BookingRecap recap={recap} announce={announce}></BookingRecap>
        <Card
          variant="outlined"
          style={{
            marginTop: "20px",
            marginLeft: "10px",
            marginRight: "10px",
            paddingBottom: "15px",
            width: "75%",
          }}
        >
          <div className="p-4 mb-0 w-100">
            <ul
              className="profile-header-tab nav nav-tabs"
              //style={{marginTop: "20px"}}
            >
              <Nav>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === 0,
                    })}
                    onClick={() => {
                      setActiveTab(0);
                    }}
                    style={{cursor: "pointer"}}
                  >
                    <FormattedMessage id="src.components.bookingPage.StepThreeForm.info" />{" "}
                    <button
                      id="btn_info"
                      className="fa fa-info-circle fa pt-3 pl-2"
                      style={{
                        color: "#7AA095",
                        background: "transparent",
                        border: "0",
                        maxWidth: "15px",
                        marginTop: "-8px",
                      }}
                    ></button>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === 1,
                    })}
                    onClick={() => {
                      setActiveTab(1);
                    }}
                  >
                    <FormattedMessage id="src.components.bookingPage.StepThreeForm.transfer" />
                    {cbPayment1 && (
                      <FontAwesome
                        className="fa fa-check pl-2 mr-3"
                        name="check"
                        size="lg"
                      />
                    )}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === 2,
                    })}
                    onClick={() => {
                      setActiveTab(2);
                    }}
                  >
                    <FormattedMessage id="src.components.bookingPage.StepThreeForm.check" />
                    {cbPayment2 && (
                      <FontAwesome
                        className="fa fa-check pl-2 mr-3"
                        name="check"
                        size="lg"
                      />
                    )}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === 3,
                    })}
                    onClick={() => {
                      setActiveTab(3);
                    }}
                  >
                    <FormattedMessage id="src.components.bookingPage.StepThreeForm.bankCard" />
                  </NavLink>
                </NavItem>
              </Nav>
            </ul>
            <TabContent
              className="p-4"
              activeTab={activeTab}
              style={{
                border: "1px solid rgba(111,111,111,0.2)",
              }}
            >
              <TabPane tabId={0}>
                <div
                  style={{
                    height: "100%",
                  }}
                >
                  <p
                    className="p-4 text-justify"
                    style={{
                      fontFamily: "Montserrat",
                      color: "black",
                    }}
                  >
                    <FormattedMessage id="src.components.bookingPage.StepProgress.description1" />
                    <span style={{color: "green"}}>
                      {_.startCase(pro.id_user.firstName)}{" "}
                      {_.upperCase(pro.id_user.lastName)}
                    </span>
                    <FormattedMessage id="src.components.bookingPage.StepProgress.description2" />
                    <br />
                    <br />
                    <FormattedMessage id="src.components.bookingPage.StepProgress.description3" />
                    <span style={{color: "green"}}>
                      {" " + _.startCase(pro.id_user.firstName)}{" "}
                      {_.upperCase(pro.id_user.lastName)}{" "}
                    </span>
                    <FormattedMessage id="src.components.bookingPage.StepProgress.description4" />
                  </p>
                </div>
              </TabPane>
              <TabPane tabId={3}>
                <div className="infoTitle" />
                <p>
                  <FormattedMessage id="src.components.bookingPage.StepThreeForm.paymentNotAvaible" />
                </p>
              </TabPane>
              <TabPane tabId={1}>
                <RibElement></RibElement>
                {open.rib && (
                  <RenderInWindow
                    comp={<RibElement prt={true}></RibElement>}
                    size={{width: 1000, height: 150, x: 400, y: 200}}
                    onClose={() => {
                      setOpen({...open, rib: false});
                    }}
                  ></RenderInWindow>
                )}
              </TabPane>
              <TabPane tabId={2}>
                <CheckElement></CheckElement>
                {open.check && (
                  <RenderInWindow
                    comp={<CheckElement prt={true}></CheckElement>}
                    size={{width: 600, height: 400, x: 400, y: 200}}
                    onClose={() => {
                      setOpen({...open, check: false});
                    }}
                  ></RenderInWindow>
                )}
              </TabPane>
            </TabContent>
          </div>
        </Card>
      </>
    )
  );
}

export default PaymentTabs;
