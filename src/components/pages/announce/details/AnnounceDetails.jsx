import {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {AppBar, Tabs, Tab} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import {FormattedMessage, useIntl} from "react-intl";
import _ from "lodash";
import {useCookies} from "react-cookie";
import TabContainer from "./common/TabContainer";
import AnnounceProgram from "./AnnounceProgram";
import EquestrianPhysicalInfo from "./EquestrianPhysicalInfo.jsx";
import PriceDatesTable from "./priceDatesTable/PriceDatesTable";
import StandardInfo from "./common/StandardInfo";
import AccomodationInfo from "./AccomodationInfo";
import PracticalInfo from "./practicalInfo/PracticalInfo";
import ProInfo from "./proInfo/ProInfo";
import ContactMessaging from "./proInfo/ContactMessaging";
import Options from "./priceDatesTable/option/Options.jsx";
import "../../../../css/draggable_resizable.css";

function AnnounceDetails({
  announce,
  proId,
  bookings,
  comments,
  onHandleFormModal,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = [];
  const uRLSearch = new URLSearchParams(location.search);
  for (let item of uRLSearch) {
    queryParams.push(item);
  }
  let tab = 0;
  try {
    if (queryParams[1][0].includes("MyBookings")) {
      tab = 3; //return on PriceDatesTable (i.e 3rd tab) when coming back from MemberPage Bookings tab (ref. to DataTable.jsx >>> EnhancedTableToolbar)
    }
  } catch (error) {}
  useEffect(() => {
    if (tab === 3)
      navigate(
        `${location.pathname}?${queryParams[0][0]}=${queryParams[0][1]}`, //remove 'MyBookings_ids, MyBookings_ann_id' parameter from url
        {replace: true, state: location.state}
      );
  }, []);
  function handleChange(event, value) {
    setState(value);
  }
  const [cookies] = useCookies(["user"]);
  const lang = useIntl().locale;
  const [state, setState] = useState(tab);
  const styles = {
    container: {
      minHeight: 100,
      maxHeight: 400,
      //WebkitOverflowScrolling: "touch", // iOS momentum scrolling
    },
  };
  return (
    <>
      <div className="justify-content-center w-100">
        <AppBar position="static" color="inherit" elevation={0}>
          <Tabs
            value={!cookies.user && state === 7 ? state - 1 : state}
            onChange={handleChange}
            centered={true}
            //variant="fullWidth"
          >
            <Tab
              label={
                <FormattedMessage id="src.components.announcePage.announceDetailTab.labels.programme" />
              }
            />
            <Tab
              label={
                <FormattedMessage id="src.components.announcePage.announceDetailTab.labels.equestrianInfo" />
              }
            />
            <Tab
              label={
                <FormattedMessage id="src.components.announcePage.announceDetailTab.labels.options" />
              }
            />
            <Tab
              label={
                <FormattedMessage id="src.components.announcePage.announceDetailTab.labels.priceDate" />
              }
            />
            <Tab
              label={
                <FormattedMessage id="src.components.announcePage.announceDetailTab.labels.houseFood" />
              }
            />
            <Tab
              label={
                <FormattedMessage id="src.components.announcePage.announceDetailTab.labels.usefulInfo" />
              }
            />
            <Tab
              label={
                <FormattedMessage id="src.components.announcePage.announceDetailTab.labels.hostingBody" />
              }
            />
            {cookies.user && (
              <Tab
                label={
                  <FormattedMessage id="src.components.announcePage.announceDetailTab.labels.contact" />
                }
              />
            )}
          </Tabs>
        </AppBar>
        <SwipeableViews
          containerStyle={styles.container}
          index={!cookies.user && state === 7 ? state - 1 : state}
        >
          <TabContainer>
            <AnnounceProgram announce={announce} />
          </TabContainer>
          <TabContainer>
            <EquestrianPhysicalInfo announce={announce} full={true} />
          </TabContainer>
          <TabContainer>
            <div className="d-flex justify-content-between mt-4 ">
              {((announce.included && announce.included[lang]) ||
                (announce.notIncluded && announce.notIncluded[lang])) && (
                <div className="col-5 ">
                  {announce.included && announce.included[lang] && (
                    <StandardInfo
                      field={announce.included}
                      lang={lang}
                      id="src.components.announcePage.announceDetailTab.labels.included"
                    ></StandardInfo>
                  )}
                  {announce.notIncluded && announce.notIncluded[lang] && (
                    <StandardInfo
                      field={announce.notIncluded}
                      lang={lang}
                      id="src.components.announcePage.announceDetailTab.labels.notIncluded"
                    ></StandardInfo>
                  )}
                </div>
              )}
              <div className="ml-4 mt-1">
                <h5 className="media-heading font-weight-bold">Options</h5>
                {announce.options.length > 0 && (
                  <Options
                    dataIn={{announce, dates: [], dateParticipants: {}}}
                    recap={{}}
                    locks={false}
                    mt={10}
                  ></Options>
                )}
              </div>
            </div>
          </TabContainer>
          <TabContainer>
            <PriceDatesTable
              className="m-0 p-0"
              typetable="announce"
              title="PriceDatesTable"
              announce={announce}
              actions={false}
              plusIcon="fa fa-plus-circle"
              objectDelete
              onHandleFormBooking={onHandleFormModal}
            />
          </TabContainer>
          <TabContainer>
            <AccomodationInfo announce={announce}></AccomodationInfo>
          </TabContainer>
          <TabContainer>
            <PracticalInfo announce={announce}></PracticalInfo>
          </TabContainer>
          <TabContainer>
            <ProInfo
              bookings={bookings}
              announce={announce}
              comments={comments}
            ></ProInfo>
          </TabContainer>
          {cookies.user ? (
            <TabContainer>
              <ContactMessaging proId={proId}></ContactMessaging>
            </TabContainer>
          ) : (
            <div></div>
          )}
        </SwipeableViews>
      </div>
    </>
  );
}

export default AnnounceDetails;
