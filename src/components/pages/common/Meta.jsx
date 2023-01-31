import React from "react";
import {FormattedMessage} from "react-intl";
import {Helmet} from "react-helmet";

function Meta({id, title1, desc2}) {
  return (
    <React.Fragment>
      <FormattedMessage id={`metaData.${id}.title`}>
        {(text) => (
          <Helmet>
            <title>
              {typeof title1 !== "undefined" ? `${title1}${text}` : `${text}`}
            </title>
          </Helmet>
        )}
      </FormattedMessage>
      <FormattedMessage id={`metaData.${id}.description`}>
        {(text) => (
          <Helmet>
            <meta
              name="description"
              content={typeof desc2 !== "undefined" ? desc2 : text}
            />
          </Helmet>
        )}
      </FormattedMessage>
    </React.Fragment>
  );
}

export default Meta;
