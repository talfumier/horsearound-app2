import {useState, useEffect} from "react";

function Person({data, onHandleChange}) {
  const {id, lastName, firstName, type, ticked} = data;
  const [values, setValues] = useState({});
  useEffect(() => {
    let vals = {
      adult: false,
      child: false,
      companion: false,
    };
    if (ticked) vals = {...vals, [ticked]: true};
    setValues(vals);
  }, [data]);
  return (
    Object.keys(values).length > 0 && (
      <tr>
        <td className="col-4 ml-4 pl-4">{`${lastName} ${firstName}`}</td>
        <td className="col-2 text-center ">
          <input
            id="adult"
            type="checkbox"
            style={{cursor: "pointer"}}
            checked={values.adult}
            onChange={(e) => {
              onHandleChange(id, !values.adult, e.target.id);
            }}
          ></input>
        </td>
        <td className="col-2 text-center ">
          <input
            id="child"
            type="checkbox"
            style={{cursor: "pointer"}}
            checked={values.child}
            onChange={(e) => {
              onHandleChange(id, !values.child, e.target.id);
            }}
          ></input>
        </td>
        <td className="col-2 text-center ">
          <input
            id="companion"
            type="checkbox"
            style={{cursor: "pointer"}}
            checked={values.companion}
            onChange={(e) => {
              onHandleChange(id, !values.companion, e.target.id);
            }}
          ></input>
        </td>
      </tr>
    )
  );
}

export default Person;
