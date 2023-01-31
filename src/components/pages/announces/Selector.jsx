import {FormattedMessage, useIntl} from "react-intl";

function Selector({intlId, onChange, onFilter, filter, handleClickFilter}) {
  const {messages} = useIntl();
  const keys = Object.keys(messages).filter((key) =>
    key.startsWith(`${intlId[0]}${intlId[2]}`)
  );
  let dataL0 = keys.filter((key) => key.includes(intlId[3]));
  dataL0 = dataL0.map((key) => key.replace(intlId[3], ""));
  return (
    <div className="row" style={{marginLeft: 50}}>
      {dataL0.map((l0) => {
        let dataL1 = Object.keys(messages).filter((key) =>
          key.startsWith(`${l0}${intlId[4]}`)
        );
        return (
          <div className="col">
            <div>
              <label
                key={l0}
                className="form-check-label"
                htmlFor="defaultCheck1"
                style={{marginLeft: 20}}
              >
                <FormattedMessage id={`${l0}${intlId[3]}`} />
              </label>
            </div>
            <div>
              {dataL1.map((key) => {
                const text = <FormattedMessage id={key} />;
                return (
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={text}
                      checked={
                        filter &&
                        typeof filter !== "string" &&
                        filter.includes(text)
                      }
                      id="2"
                      onChange={(e) => this.handleChange(e)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="defaultCheck1"
                      style={{marginLeft: 20}}
                    >
                      text
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Selector;
