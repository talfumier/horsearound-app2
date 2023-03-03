import {createTheme} from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import _ from "lodash";

export function getMuiThemes(compName, lang) {
  const locale_idx = _.filter(Object.keys(locales), (s) => {
    return s.indexOf(lang) !== -1;
  });
  switch (compName) {
    case "DatesTable":
      return {
        header: createTheme({
          components: {
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                  fontSize: "1.4rem",
                  textAlign: "center",
                },
              },
            },
          },
        }),
        body: createTheme({
          components: {
            MuiTableBody: {
              styleOverrides: {
                root: {},
              },
            },
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "#f5f5f5",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  fontSize: "1rem",
                  color: "GrayText",
                  justifyContent: "center",
                  textAlign: "center",
                },
              },
            },
          },
        }),
        footer: createTheme({
          components: {
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "white",
                  height: "25px",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  color: "red",
                  fontSize: "1.4rem",
                  fontWeight: "bolder",
                  fontStyle: "italic",
                  textAlign: "center",
                },
              },
            },
          },
        }),
      };
    case "MyAnnouncesTable":
      return {
        toolbar: createTheme(
          {
            components: {
              MuiTooltip: {
                styleOverrides: {
                  tooltip: {
                    fontSize: "1.5rem",
                    fontFamily: "calibri",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    backgroundColor: "#7aa095",
                    color: "#ffffff",
                    border: "solid 1px ",
                    borderColor: "yellow",
                  },
                  arrow: {
                    backgroundColor: "transparent",
                    color: "#7aa095",
                    border: "solid 1px ",
                    borderColor: "yellow",
                  },
                },
              },
              MuiToolbar: {
                styleOverrides: {
                  root: {
                    backgroundColor: "#f5f5f5",
                  },
                },
              },
            },
          },
          locales[locale_idx]
        ),
        header: createTheme({
          components: {
            MuiTableSortLabel: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                },
              },
              "&$active": {
                color: "white",
              },
            },
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                  fontSize: "1.2rem",
                  textAlign: "center",
                },
              },
            },
          },
        }),
        body: createTheme({
          components: {
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "#f5f5f5",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  fontSize: "1.2rem",
                  color: "GrayText",
                  alignContent: "center",
                },
              },
            },
          },
        }),
        footer: createTheme(
          {
            components: {
              MuiTablePagination: {
                styleOverrides: {
                  displayedRows: {fontSize: "1.2rem"},
                  MuiTableCell: {size: "medium"},
                  backIconButtonProps: {
                    color: "red",
                    size: "large",
                  },
                  nextIconButtonProps: {
                    color: "primary",
                    fontSize: "1.3rem",
                  },
                },
              },
            },
          },
          locales[locale_idx]
        ),
      };
    case "MyInvoicesTable":
    case "MyBookingsTable":
      return {
        infos: createTheme(
          {
            components: {
              MuiTooltip: {
                styleOverrides: {
                  tooltip: {
                    fontSize: "1.3rem",
                    fontFamily: "calibri",
                    padding: "5px",
                    backgroundColor: "#4472C4",
                    color: "#ffffff",
                    border: "solid 1px ",
                    borderColor: "yellow",
                  },
                  arrow: {
                    backgroundColor: "transparent",
                    color: "#4472C4",
                    border: "solid 1px ",
                    borderColor: "yellow",
                  },
                },
              },
            },
          },
          locales[locale_idx]
        ),
        toolbar: createTheme(
          {
            components: {
              MuiTooltip: {
                styleOverrides: {
                  tooltip: {
                    fontSize: "1.5rem",
                    fontFamily: "calibri",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    backgroundColor: "#7aa095",
                    color: "#ffffff",
                    border: "solid 1px ",
                    borderColor: "yellow",
                  },
                  arrow: {
                    backgroundColor: "transparent",
                    color: "#7aa095",
                    border: "solid 1px ",
                    borderColor: "yellow",
                  },
                },
              },
              MuiToolbar: {
                styleOverrides: {
                  root: {
                    backgroundColor: "#f5f5f5",
                  },
                },
              },
            },
          },
          locales[locale_idx]
        ),
        header: createTheme({
          components: {
            MuiTooltip: {
              styleOverrides: {
                tooltip: {
                  fontSize: "1.4rem",
                  fontFamily: "calibri",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  backgroundColor: "#7aa095",
                  color: "#ffffff",
                  border: "solid 1px ",
                  borderColor: "yellow",
                },
                arrow: {
                  backgroundColor: "transparent",
                  color: "#7aa095",
                  border: "solid 1px ",
                  borderColor: "yellow",
                },
              },
            },
            MuiTableSortLabel: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                },
              },
              "&$active": {
                color: "white",
              },
            },
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                  fontSize: "1.4rem",
                  textAlign: "center",
                  height: 35,
                  paddingLeft: 0,
                  paddingRight: 0,
                },
              },
            },
          },
        }),
        body: createTheme({
          components: {
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "#f5f5f5",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  fontSize: "1.2rem",
                  color: "GrayText",
                  alignContent: "center",
                  padding: 0,
                },
              },
            },
          },
        }),
        footer: createTheme(
          {
            components: {
              MuiTablePagination: {
                styleOverrides: {
                  displayedRows: {fontSize: "1.2rem"},
                  MuiTableCell: {size: "medium"},
                  backIconButtonProps: {
                    color: "red",
                    size: "large",
                  },
                  nextIconButtonProps: {
                    color: "primary",
                    fontSize: "1.3rem",
                  },
                },
              },
            },
          },
          locales[locale_idx]
        ),
      };
    case "PriceDatesTable":
      return {
        toolbar: createTheme(
          {
            components: {
              MuiToolbar: {
                styleOverrides: {
                  root: {
                    backgroundColor: "#f5f5f5",
                  },
                },
              },
            },
          },
          locales[locale_idx]
        ),
        header: createTheme({
          components: {
            MuiTableSortLabel: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                },
              },
              "&$active": {
                color: "white",
              },
            },
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                  fontSize: "1.2rem",
                  textAlign: "center",
                },
              },
            },
          },
        }),
        header_sx: {
          "& .MuiTableSortLabel-icon": {
            color: "white !important",
          },
        },
        body: createTheme({
          components: {
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "#f5f5f5",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  fontSize: "1.2rem",
                  color: "GrayText",
                },
              },
            },
          },
        }),
        footer: createTheme(
          {
            components: {
              MuiTablePagination: {
                styleOverrides: {
                  displayedRows: {fontSize: "1.2rem"},
                  MuiTableCell: {size: "medium"},
                  backIconButtonProps: {
                    color: "red",
                    size: "large",
                  },
                  nextIconButtonProps: {
                    color: "primary",
                    fontSize: "1.3rem",
                  },
                },
              },
            },
          },
          locales[locale_idx]
        ),
      };
    case "CountersTable":
      return {
        header: createTheme({
          components: {
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                  height: "35px",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  backgroundColor: "#7aa095",
                  color: "white",
                  fontSize: "1.4rem",
                  textAlign: "center",
                  padding: "2px",
                },
              },
            },
          },
        }),
        body: createTheme({
          components: {
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "#f5f5f5",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  fontSize: "1rem",
                  color: "GrayText",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "2px",
                },
              },
            },
          },
        }),
        footer: createTheme({
          components: {
            MuiTableRow: {
              styleOverrides: {
                root: {
                  backgroundColor: "white",
                  height: "25px",
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  color: "red",
                  fontSize: "1.4rem",
                  fontWeight: "bolder",
                  fontStyle: "italic",
                  textAlign: "center",
                },
              },
            },
          },
        }),
      };
    case "FormBooking":
      return {
        tabs: createTheme({
          components: {
            MuiAppBar: {
              styleOverrides: {
                root: {margin: 0, padding: 0},
              },
            },
            MuiTabs: {
              styleOverrides: {
                root: {
                  backgroundColor: "#F5F5F5",
                  height: "60px",
                },
                indicator: {
                  height: "3px",
                },
              },
            },
            MuiTab: {
              styleOverrides: {
                root: {
                  backgroundColor: "#F5F5F5",
                  fontWeight: "bold",
                  marginLeft: "20px",
                  marginRight: "20px",
                  color: "#7aa095",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                    color: "#375623",
                  },
                  "@media (min-width:576px)": {
                    fontSize: "1rem",
                  },
                  "@media (min-width:768px)": {
                    fontSize: "1.3rem",
                  },
                  "@media (min-width:1200px)": {
                    fontSize: "1.3rem",
                  },
                },
              },
            },
          },
        }),
      };
  }
}
