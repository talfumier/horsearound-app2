import {useState, useEffect} from "react";
import {useIntl} from "react-intl";
import {Col} from "react-bootstrap";
import {useCookies} from "react-cookie";
import SimpleText from "../announces/form/SimpleText.jsx";
import PopperInfo from "../announces/form/PopperInfo.jsx";
import {isEven} from "../../utils/utilityFunctions.js";
import {checkCodeParrainage} from "../../../../services/httpUsers.js";
import {errorHandlingToast} from "../../../../services/utilsFunctions.js";

function SponsoredBy({reset, dataIn, valid, onHandleGlobals}) {
  const {locale, formatMessage} = useIntl();
  const [cookies, setCookie] = useCookies(["user"]);
  const [state, setState] = useState(null);
  const abortController = new AbortController(),
    signal = abortController.signal;
  async function getCompany(code) {
    if (code.length === 10) {
      const res = await checkCodeParrainage(code, cookies.user, signal);
      const bl = !(await errorHandlingToast(res, locale, false));
      if (bl) {
        return [
          [res.data.corpName],
          [res.data.address.address],
          [
            `${res.data.address.postcode} ${res.data.address.city} - ${res.data.address.country}`,
          ],
        ];
      }
    }
    return [
      [
        formatMessage({
          id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.code_parrainage_usedWarning",
        }),
      ],
    ];
  }
  useEffect(() => {
    async function loadData() {
      const res = await getCompany(
        isEven(reset) ? dataIn.data.default : dataIn.data.saved
      );
      setState(res);
    }
    loadData();
    return () => {
      abortController.abort(); //clean-up code after component has unmounted
    };
  }, [dataIn]);
  async function handleGlobals(cs, val) {
    const res = await getCompany(val[1]);
    setState(res);
    onHandleGlobals(cs, val);
  }
  return (
    <>
      <SimpleText
        reset={reset}
        dataIn={dataIn}
        required={false}
        ph={formatMessage({
          id: "src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.code_parrainage_usedPH",
        })}
        valid={valid}
        onHandleGlobals={handleGlobals}
        w="110%"
        wl="120px"
      ></SimpleText>
      <Col>
        <PopperInfo
          data={state}
          idTT="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.labels.code_parrainage_usedTT"
          icon="fa fa-info-circle fa-2x mx-0 px-0 mt-2 pt-1"
        ></PopperInfo>
      </Col>
    </>
  );
}

export default SponsoredBy;
