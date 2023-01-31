import {useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";

function Counter({
  type,
  participant,
  price,
  maxReached,
  locks,
  onHandleIncrements,
}) {
  //id [0,1,2] >> [adulte,children,accompagnateur]
  const [cnt, setCount] = useState(0);
  useEffect(() => {
    setCount(participant);
  });
  function handleClick(cs) {
    if (cs === "+" && maxReached) return;
    const increment = cs === "+" ? 1 : -1;
    if (typeof price !== "string") {
      setCount(cnt + increment);
      const costIncrement = price * increment;
      onHandleIncrements(increment, costIncrement);
    }
  }
  const style = {
    margin: "0",
    paddingLeft: "2px",
    paddingRight: "2px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "3px",
    minWidth: "75px",
  };
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <button
              className="btn btn-light fa fa-minus"
              onClick={() => {
                handleClick("-");
              }}
              disabled={locks || cnt === 0 || typeof price === "string"}
            ></button>
          </td>
          <td>
            <table style={{borderWidth: "5px"}}>
              <tbody>
                <tr>
                  <td>
                    <h5 disabled={true} style={style}>
                      {cnt}
                    </h5>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5 style={style}>
                      {`${price} €`}
                      {type === "Flex_Flex" && (
                        <FormattedMessage id="src.components.homePage.ActivityBox.day" />
                      )}
                    </h5>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>
            <button
              className="btn btn-light fa fa-plus"
              onClick={() => {
                handleClick("+");
              }}
              disabled={locks || typeof price === "string"}
            ></button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default Counter;
