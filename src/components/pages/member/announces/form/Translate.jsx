import {FormattedMessage} from "react-intl";

function Translate({onHandleTranslate}) {
  const styles = {
    icon: {fontSize: "2rem", color: "#7aa095", cursor: "pointer"},
    text: {width: "65px", fontSize: "1.3rem", textAlign: "center"},
  };
  return (
    <div>
      <div className="form-inline mt-4 pt-1" style={{width: "100%"}}>
        <span
          style={styles.icon}
          className="glyphicon"
          onClick={() => {
            onHandleTranslate("lh");
          }}
        >
          &#xe132;
        </span>
        <span className="mx-1" style={styles.text}>
          <FormattedMessage id="src.components.memberPage.tabs.annonces.details.AddAnnounceForm.translate" />
        </span>
        <span
          style={styles.icon}
          className="glyphicon"
          onClick={() => {
            onHandleTranslate("rh");
          }}
        >
          &#xe131;
        </span>
      </div>
    </div>
  );
}

export default Translate;
