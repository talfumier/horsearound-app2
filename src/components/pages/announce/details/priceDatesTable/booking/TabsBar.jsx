import {useState, useEffect} from "react";
import {Tabs, Tab, ThemeProvider} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import FontAwesome from "react-fontawesome";
import {getMuiThemes} from "../../../../common/mui/MuiThemes";

function TabsBar({tab, tabsCheck, onHandleChange}) {
  const lang = useIntl().locale;
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(tab);
  }, [tab]);
  function handleChange(e, newValue) {
    setValue(newValue);
    onHandleChange(newValue);
  }
  const themes = getMuiThemes("FormBooking", lang);
  return (
    Object.keys(tabsCheck).length > 0 && (
      <div className="d-flex justify-content-center ">
        <ThemeProvider theme={themes.tabs}>
          <Tabs value={value} onChange={handleChange}>
            <Tab
              icon={
                <>
                  <FontAwesome
                    className="fa-solid fa-calendar pl-3 "
                    name="calendar"
                    size="lg"
                  />
                  {tabsCheck["0"] && (
                    <FontAwesome
                      className="fa fa-check pl-3"
                      name="check"
                      size="lg"
                    />
                  )}
                </>
              }
              iconPosition="end"
              label={
                <FormattedMessage id="src.components.bookingPage.StepProgress.bookingStep" />
              }
              style={{cursor: "pointer"}}
            />
            <Tab
              icon={
                <>
                  <FontAwesome
                    className="fa fa-shopping-cart pl-3"
                    name="option"
                    size="lg"
                  />
                  {tabsCheck["1"] && (
                    <FontAwesome
                      className="fa fa-check pl-3"
                      name="check"
                      size="lg"
                    />
                  )}
                </>
              }
              iconPosition="end"
              label={
                <FormattedMessage id="src.components.bookingPage.StepProgress.optionStep" />
              }
            />
            <Tab
              icon={
                <>
                  <FontAwesome
                    className="fa-solid fa-user pl-3"
                    name="user"
                    size="lg"
                  />
                  {tabsCheck["2"] && (
                    <FontAwesome
                      className="fa fa-check pl-3"
                      name="check"
                      size="lg"
                    />
                  )}
                </>
              }
              iconPosition="end"
              label={
                <FormattedMessage id="src.components.bookingPage.StepProgress.registrationStep" />
              }
            />
            <Tab
              icon={
                <>
                  <FontAwesome
                    className="fa-solid fa-user pl-3"
                    name="user"
                    size="lg"
                  />
                  {!tabsCheck["3"].red && tabsCheck["3"].cbAccept && (
                    <FontAwesome
                      className="fa fa-check pl-3"
                      name="check"
                      size="lg"
                    />
                  )}
                </>
              }
              iconPosition="end"
              label={
                <FormattedMessage id="src.components.bookingPage.StepProgress.invoiceStep" />
              }
            />
            <Tab
              icon={
                <>
                  <FontAwesome
                    className="fa fa-eur pl-3"
                    name="eur"
                    size="lg"
                  />
                  {tabsCheck["4"] && (
                    <FontAwesome
                      className="fa fa-check pl-3"
                      name="check"
                      size="lg"
                    />
                  )}
                </>
              }
              iconPosition="end"
              label={
                <FormattedMessage id="src.components.bookingPage.StepProgress.paymentStep" />
              }
            />
            <Tab
              icon={
                <>
                  {tabsCheck["5"] && (
                    <FontAwesome
                      className="fa fa-check pl-3"
                      name="check"
                      size="lg"
                    />
                  )}
                </>
              }
              iconPosition="end"
              label={
                <FormattedMessage id="src.components.bookingPage.StepProgress.confirmStep" />
              }
            />
          </Tabs>
        </ThemeProvider>
      </div>
    )
  );
}

export default TabsBar;
