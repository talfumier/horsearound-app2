import {useIntl} from "react-intl";
import Opts from "./priceDatesTable/option/Options.jsx";
import StandardInfo from "./common/StandardInfo.jsx";

function Options({announce}) {
  const {locale} = useIntl();
  return (
    <div className="d-flex justify-content-between mt-4 ">
      {((announce.included && announce.included[locale]) ||
        (announce.notIncluded && announce.notIncluded[locale])) && (
        <div className="col-6">
          <StandardInfo
            field={announce.included}
            lang={locale}
            id="src.components.announcePage.announceDetailTab.labels.included"
          ></StandardInfo>
          <StandardInfo
            field={announce.notIncluded}
            lang={locale}
            id="src.components.announcePage.announceDetailTab.labels.notIncluded"
          ></StandardInfo>
        </div>
      )}
      <div className="ml-4 mt-1">
        {announce.options.length > 0 && (
          <>
            <h5 className="media-heading font-weight-bold">Options</h5>
            <Opts
              dataIn={{announce, dates: [], dateParticipants: {}}}
              recap={{}}
              locks={false}
              mt={10}
            ></Opts>
          </>
        )}
      </div>
    </div>
  );
}

export default Options;
