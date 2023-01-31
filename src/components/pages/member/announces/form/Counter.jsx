import {useState, useEffect} from "react";

function Counter({id, promotion, onHandleIncrements}) {
  const [cnt, setCount] = useState(0);
  useEffect(() => {
    setCount(promotion);
  });
  function handleClick(id, cs) {
    const increment = cs === "+" ? 5 : -5;
    setCount(cnt + increment);
    onHandleIncrements(id, increment);
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
              className="btn btn-light fa fa-minus px-2 py-1"
              onClick={() => {
                handleClick(id, "-");
              }}
              disabled={cnt === 0}
            ></button>
          </td>
          <td>
            <table style={{borderWidth: "5px"}}>
              <tbody>
                <tr>
                  <td>
                    <h5 style={style}>{`${cnt} %`}</h5>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>
            <button
              className="btn btn-light fa fa-plus px-2 py-1"
              onClick={() => {
                handleClick(id, "+");
              }}
              disabled={cnt === 100}
            ></button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default Counter;
