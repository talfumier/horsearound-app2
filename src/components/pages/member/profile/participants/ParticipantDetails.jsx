import {useState} from "react";
import {styled} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import {useIntl} from "react-intl";
import {Container, Row} from "react-bootstrap";
import {useCookies} from "react-cookie";
import {decodeJWT} from "../../../../../services/httpUsers.js";
import SimpleText from "../../announces/form/SimpleText.jsx";
import {isEven} from "../../../utils/utilityFunctions.js";
import {SwalOkCancel} from "../../../common/toastSwal/SwalOkCancel.jsx";
import {checkParticipantDelete} from "../../../../../services/httpUsers.js";
import {errorHandlingToast} from "../../../../../services/utilsFunctions.js";
import {toastError} from "../../../common/toastSwal/ToastMessages.js";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: "0.9rem"}} />}
    {...props}
  />
))(({theme}) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
  padding: theme.spacing(0),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function ParticipantDetails({
  reset,
  expanded: expd,
  values,
  id,
  onHandleGlobals,
  onHandleParticipant,
}) {
  const {locale, formatMessage} = useIntl();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const currentUser = cookies.user ? decodeJWT(cookies.user) : null;
  const [expanded, setExpanded] = useState(
    expd === null ? false : expd[id] ? expd[id] : false
  );
  function handleExpansion() {
    setExpanded(!expanded);
  }
  function handleGlobals(cs, val) {
    onHandleGlobals(cs, val, id);
  }
  async function deleteConditionsSatisfied(partId) {
    const abortController = new AbortController();
    const res = await checkParticipantDelete(
      currentUser._id,
      partId,
      cookies.user,
      abortController.signal
    );
    if (!(await errorHandlingToast(res, locale, false))) {
      if (!res.data) {
        const msg = `${formatMessage({
          id: `src.components.memberPage.tabs.annonces.details.AddAnnounceForm.bookingsByDayFailure`,
        })}`;
        return [res.data, msg];
      }
      return [true];
    }
    abortController.abort();
  }
  return (
    <Accordion
      expanded={expanded}
      onChange={(e) => {
        if (e.target.id === "deleteParticipant") return;
        handleExpansion();
      }}
    >
      <AccordionSummary>
        <div className="col-2">
          {`${values[1].data[isEven(reset) ? "default" : "saved"]} ${
            values[0].data[isEven(reset) ? "default" : "saved"]
          }`}
        </div>
        <div>
          <i
            id="deleteParticipant"
            className="fa fa-trash fa-lg ml-4 "
            style={{
              cursor: " pointer",
              color: "#7aa095",
            }}
            onClick={async (e) => {
              let result = await deleteConditionsSatisfied(id);
              if (!result[0]) {
                toastError(result[1]);
                return;
              }
              result = await SwalOkCancel(
                formatMessage,
                "src.components.memberPage.tabs.annonces.MyAnnonces.delete"
              );
              if (result === "cancel") return;
              onHandleParticipant("del", id);
            }}
          ></i>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Container style={{minWidth: "100%", marginTop: 0}}>
          <Row className="justify-content-md-left pl-1 mt-0 ">
            <SimpleText
              reset={reset}
              dataIn={values[1]} //lastName
              required={false}
              valid={true}
              onHandleGlobals={handleGlobals}
              wl="90px"
            ></SimpleText>
            <SimpleText
              reset={reset}
              dataIn={values[0]} //firstName
              required={false}
              valid={true}
              onHandleGlobals={handleGlobals}
              w="70%"
              wl="100px"
            ></SimpleText>
            <SimpleText
              reset={reset}
              dataIn={values[2]} //email
              required={false}
              valid={true}
              onHandleGlobals={handleGlobals}
              w="100%"
              wl="50px"
            ></SimpleText>
            <SimpleText
              reset={reset}
              dataIn={values[3]} //phone
              required={false}
              valid={true}
              onHandleGlobals={handleGlobals}
              w="75%"
              wl="90px"
            ></SimpleText>
          </Row>
          <Row className="justify-content-md-left pl-1 mt-0">
            <SimpleText
              reset={reset}
              type="inputMask"
              mask={{mask: "99.99.9999", maskChar: "_"}}
              ph={formatMessage({
                id: "src.components.bookingPage.StepTwoContent.dateformat",
              })}
              trash={false}
              dataIn={values[4]} //birthdate
              required={false}
              valid={true}
              onHandleGlobals={handleGlobals}
              col="1"
              w="95%"
              wl="90px"
              wl_max="60px"
            ></SimpleText>
            <SimpleText
              reset={reset}
              dataIn={values[5]} //birthplace
              required={false}
              valid={true}
              onHandleGlobals={handleGlobals}
              w="90%"
              wl="40px"
            ></SimpleText>
            <SimpleText
              reset={reset}
              dataIn={values[9]} //occupation
              required={false}
              valid={true}
              onHandleGlobals={handleGlobals}
              w="90%"
            ></SimpleText>
          </Row>
          <Row className="justify-content-md-left pl-1 mt-0 mb-2">
            <SimpleText
              type="select"
              options={[
                [
                  "M",
                  formatMessage({
                    id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.male",
                  }),
                ],
                [
                  "F",
                  formatMessage({
                    id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.female",
                  }),
                ],
                ["", ""],
              ]}
              reset={reset}
              trash={false}
              dataIn={values[6]} //sex
              required={false}
              valid={true}
              onHandleGlobals={handleGlobals}
              col="1"
              w="95%"
              wl="90px"
            ></SimpleText>
            <SimpleText
              reset={reset}
              dataIn={values[7]} //height
              required={false}
              valid={true}
              onHandleGlobals={handleGlobals}
              col="1"
              w="60%"
              wl="75px"
            ></SimpleText>
            <label className="mt-2 ml-0 pl-0 mr-0">
              <h5
                style={{
                  color: "black",
                  fontWeight: 500,
                  marginLeft: -50,
                }}
              >
                {"cm"}
              </h5>
            </label>
            <SimpleText
              reset={reset}
              dataIn={values[8]} //weight
              required={false}
              valid={true}
              onHandleGlobals={handleGlobals}
              col="1"
              w="60%"
              wl="75px"
            ></SimpleText>
            <label className="mt-2 ml-0 pl-0 mr-0">
              <h5
                style={{
                  color: "black",
                  fontWeight: 500,
                  marginLeft: -50,
                }}
              >
                {"Kg"}
              </h5>
            </label>{" "}
            <SimpleText
              type="textarea"
              reset={reset}
              dataIn={values[10]} //diet
              required={false}
              w="120%"
              wl_max="80px"
              valid={true}
              ph={formatMessage({
                id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.dietPH",
              })}
              onHandleGlobals={handleGlobals}
            ></SimpleText>
            <SimpleText
              type="textarea"
              reset={reset}
              dataIn={values[11]} //treatment
              required={false}
              mleft="3.5%"
              w="120%"
              wl_max="80px"
              valid={true}
              ph={formatMessage({
                id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.treatmentPH",
              })}
              onHandleGlobals={handleGlobals}
            ></SimpleText>
          </Row>
        </Container>
      </AccordionDetails>
    </Accordion>
  );
}

export default ParticipantDetails;
