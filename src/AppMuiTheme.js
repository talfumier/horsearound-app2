import {red} from "@mui/material/colors";
import {createTheme} from "@mui/material/styles";

export function getMuiTheme() {
  return createTheme({
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "#F2F2F2", //"#F2F2F2", //"#EDF1F9",
          },
        },
      },
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
      MuiAppBar: {
        styleOverrides: {
          colorDefault: {
            backgroundColor: "white",
          },
          root: {},
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            backgroundColor: "white",
            borderRadius: 10,
            borderColor: "#7AA095",
            borderStyle: "solid",
            borderWidth: "0.5px",
            margin: "0px",
          },
          indicator: {
            backgroundColor: "#7AA095",
          },
          centered: {
            backgroundColor: "#F5F5F5",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            backgroundColor: "#F5F5F5",
            color: "#7AA095",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#7AA095",
              color: "white",
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
          fullWidth: {padding: "0", margin: "0"},
          wrapped: {padding: "0", margin: "0"},
        },
      },
    },
  });
}
