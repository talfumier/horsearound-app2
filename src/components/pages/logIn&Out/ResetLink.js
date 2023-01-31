import {useParams} from "react-router-dom";

const ResetLink = () => {
  const {id, token} = useParams();
  console.log(id, token);
  window.close();
};

export default ResetLink;
