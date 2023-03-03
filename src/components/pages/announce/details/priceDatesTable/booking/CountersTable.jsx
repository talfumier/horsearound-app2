import {useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ThemeProvider,
  TableFooter,
} from "@mui/material";
import _ from "lodash";
import Counter from "./Counter";
import {getMuiThemes} from "../../../../common/mui/MuiThemes";
import {getFormattedDate} from "../../../../utils/utilityFunctions.js";
import {sumOfPropsValues} from "../../../../utils/utilityFunctions.js";

export function getTotalCost(dates, cost) {
  const tot = {0: 0, 1: 0, 2: 0};
  dates.map((date) => {
    [0, 1, 2].map((i) => {
      tot[i] += cost[date.id][i];
    });
  });
  return tot;
}
export function getDaysNights(nbDays, nbNights, duration) {
  if (!isNaN(nbDays) && !isNaN(nbNights)) return `${nbDays}/${nbNights}`; //Fixed_Fixed, Flex_Fixed
  if (!isNaN(nbNights)) return `${duration}/${nbNights}`; //Flex_Flex 'n/0'
  const nights = nbNights.slice(-2);
  switch (nights.slice(0, 1)) {
    case "+":
      return `${duration}/${duration + nights.slice(-1)}`; //Flex_Flex 'n/n+x'
    case "-":
      return `${duration}/${duration - nights.slice(-1)}`; //Flex_Flex 'n/n-x'
    case "n":
      return `${duration}/${duration}`; //Flex_Flex 'n/n'
  }
}
function CountersTable({
  announce,
  data,
  locks,
  onHandleParticipants,
  onHandleDelete,
}) {
  const intl = useIntl();
  const lang = intl.locale;
  const theme = getMuiThemes("CountersTable", lang);
  const basicPrice = [
    announce.priceAdulte,
    announce.priceChild,
    announce.priceAccompagnateur,
  ];
  const dates =
    announce.datesType === "Fixed_Fixed" ? data.dates : data.selection;
  const totalCost = getTotalCost(dates, data.cost);
  function getTotalDateParticipants(dateId) {
    return (
      sumOfPropsValues(data.dateParticipants[dateId].booking) +
      data.dateParticipants[dateId].registered
    );
  }
  function getPromotion(date) {
    switch (announce.datesType) {
      case "Fixed_Fixed":
        return date.promotion && date.promotion !== null
          ? (100 - date.promotion) / 100
          : 1;
      default:
        const result = _.filter(data.dates, {id: date.master_id})[0];
        return result.promotion && result.promotion !== null
          ? (100 - result.promotion) / 100
          : 1;
    }
  }
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <ThemeProvider theme={theme.header}>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                {`${_.startCase(
                  intl.formatMessage({id: "global.days"})
                )}/${_.startCase(intl.formatMessage({id: "global.nights"}))}`}
              </TableCell>
              <TableCell>
                <FormattedMessage id="src.components.announcePage.booking.adults"></FormattedMessage>
              </TableCell>
              <TableCell>
                <FormattedMessage id="src.components.announcePage.booking.children"></FormattedMessage>
              </TableCell>
              <TableCell>
                <FormattedMessage id="src.components.announcePage.booking.accompanying"></FormattedMessage>
              </TableCell>
              <TableCell>
                <FormattedMessage id="src.components.announcePage.announceDetailTab.moreInfoTable.peopleCapacity1"></FormattedMessage>
              </TableCell>
            </TableRow>
          </TableHead>
        </ThemeProvider>
        <ThemeProvider theme={theme.body}>
          {dates.length > 0 && (
            <TableBody>
              {_.orderBy(dates, ["startDate"], ["asc"]).map((date, index) => {
                return (
                  <TableRow
                    key={index}
                    style={{backgroundColor: `${date.rangeColor}8f`}}
                  >
                    <TableCell
                      sx={{
                        m: 0,
                      }}
                    >
                      <h5>{`${getFormattedDate(
                        date.startDate,
                        "dd.MM.yyyy"
                      )} - ${getFormattedDate(
                        date.endDate,
                        "dd.MM.yyyy"
                      )}`}</h5>
                    </TableCell>
                    <TableCell
                      sx={{
                        p: 0,
                        m: 0,
                      }}
                    >
                      <button
                        className="fa fa-trash fa-2x p-0 m-0"
                        style={{
                          backgroundColor: "transparent",
                          border: "0",
                        }}
                        onClick={() => {
                          if (locks) return;
                          onHandleDelete(date);
                        }}
                      ></button>
                    </TableCell>
                    <TableCell>
                      <h5>
                        {getDaysNights(
                          announce.nbDays,
                          announce.nbNights,
                          date.duration
                        )}
                      </h5>
                    </TableCell>
                    {basicPrice.map((price, idx) => {
                      return (
                        <TableCell key={idx}>
                          <Counter
                            type={announce.datesType}
                            participant={
                              data.dateParticipants[date.id].booking[idx]
                            }
                            price={
                              typeof price !== "undefined"
                                ? price * getPromotion(date)
                                : "- - -"
                            }
                            maxReached={
                              getTotalDateParticipants(date.id) ===
                              announce.participantMax
                            }
                            locks={locks}
                            onHandleIncrements={(inc, costInc) => {
                              onHandleParticipants(date.id, idx, inc, costInc);
                            }}
                          ></Counter>
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <h5
                        style={{
                          color:
                            getTotalDateParticipants(date.id) ===
                            announce.participantMax
                              ? "red"
                              : "",
                        }}
                      >
                        {`${getTotalDateParticipants(date.id)}/${
                          announce.participantMax
                        }`}
                      </h5>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </ThemeProvider>
        <ThemeProvider theme={theme.footer}>
          <TableFooter>
            <TableRow>
              <TableCell>
                <FormattedMessage id="src.components.announcePage.booking.totalCost"></FormattedMessage>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{`${totalCost[0]} €`}</TableCell>
              <TableCell>{`${totalCost[1]} €`}</TableCell>
              <TableCell>{`${totalCost[2]} €`}</TableCell>
              <TableCell
                style={{
                  backgroundColor: "yellow",
                }}
              >{`${sumOfPropsValues(totalCost)} €`}</TableCell>
            </TableRow>
          </TableFooter>
        </ThemeProvider>
      </Table>
    </TableContainer>
  );
}

export default CountersTable;
