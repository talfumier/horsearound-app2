import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {Row, Col} from "react-bootstrap";
import {Card} from "@mui/material";
import "../bookings/dataTable/summary/styles.css";
import {getCompany} from "../../../../services/httpUsers.js";
import {errorHandlingToast} from "../../../../services/utilsFunctions.js";

function CorporateSummary({pro}) {
  const {locale, formatMessage} = useIntl();
  const [company, setCompany] = useState({});
  useEffect(() => {
    async function loadData(id, signal) {
      const res = await getCompany(id, signal);
      if (!(await errorHandlingToast(res, locale, false))) setCompany(res.data);
    }
    const abortController = new AbortController();
    loadData(pro, abortController.signal);
  }, []);
  return (
    Object.keys(company).length > 0 && (
      <Card
        variant="outlined"
        className="summary card"
        style={{
          marginTop: "20px",
          marginLeft: "10px",
          marginRight: "10px",
          paddingBottom: "40px",
          width: "75%",
          borderWidth: "1px",
        }}
      >
        <Row key={"1"} className="justify-content-md-left ">
          <Col className="summary title rib ">
            <label>
              <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.corpName" />
            </label>
            <textarea
              disabled={true}
              value={`${company.corpName}`}
              className="form-control "
              rows="5"
              cols="20"
            ></textarea>
          </Col>
          <Col className="summary title rib ">
            <label>
              <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.address" />
            </label>
            <textarea
              disabled={true}
              value={`${company.address.address}\n${company.address.postcode} ${company.address.city}\n${company.address.country}`}
              className="form-control wrap"
              style={{alignContent: "left"}}
              rows="5"
              cols="25"
            ></textarea>
          </Col>
        </Row>
        <Row key={"2"} className="justify-content-md-left ">
          <Col className="summary title rib">
            <label style={{width: "6%"}}>
              <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.siren" />
            </label>
            <input
              type="text"
              disabled={true}
              value={`${company.siren}`}
              className="summary normal text-center"
              style={{width: "25%"}}
            ></input>
            <label style={{width: "5%"}}>
              <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.siret" />
            </label>
            <input
              type="text"
              disabled={true}
              value={`${company.siret}`}
              className="summary normal text-center"
              style={{width: "25%"}}
            ></input>
            <label>
              <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.assuranceNumber" />
            </label>
            <input
              type="text"
              disabled={true}
              value={`${company.assuranceNumber}`}
              className="summary normal text-center"
              style={{width: "20%"}}
            ></input>
          </Col>
        </Row>

        <Row key={"3"} className="justify-content-md-left ">
          <Col className="summary title rib">
            <label style={{width: "6%"}}>{"RIB"}</label>
            <input
              type="text"
              disabled={true}
              value={`${company.bankCode}  ${company.guichetCode}  ${company.numberAccount}  ${company.keyAccount}`}
              className="summary normal text-center"
              style={{width: "55%"}}
            ></input>
          </Col>
        </Row>
        <Row key={"4"} className="justify-content-md-left ">
          <Col className="summary title rib">
            <label style={{width: "6%"}}>{"IBAN"}</label>
            <input
              type="text"
              disabled={true}
              value={`${company.iban}`}
              className="summary normal text-center"
              style={{width: "55%"}}
            ></input>
            <label style={{width: "5%"}}>{"BIC"}</label>
            <input
              type="text"
              disabled={true}
              value={`${company.bic}`}
              className="summary normal text-center"
              style={{width: "20%"}}
            ></input>
          </Col>
        </Row>
        <Row key={"5"} className="justify-content-md-left ">
          <Col className="summary title rib ">
            <label>
              <FormattedMessage id="src.components.bookingPage.StepThreeForm.chequeOrder" />
            </label>
            <textarea
              disabled={true}
              value={`${company.checkOrder}`}
              className="form-control "
              rows="5"
              cols="20"
            ></textarea>
          </Col>
          <Col className="summary title rib ">
            <label>
              <FormattedMessage id="src.components.bookingPage.StepThreeForm.dispatchAddress" />
            </label>
            <textarea
              disabled={true}
              value={`${company.checkAdress}`}
              className="form-control "
              rows="5"
              cols="25"
            ></textarea>
          </Col>
        </Row>
      </Card>
    )
  );
}

export default CorporateSummary;
