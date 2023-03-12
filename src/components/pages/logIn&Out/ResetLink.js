import {useParams} from "react-router-dom";

const ResetLink = () => {
  const {id, token} = useParams();
  window.close();
};

export default ResetLink;
