import {ToastContainer, toast} from "react-toastify";

function ContainerToast() {
  return (
    <ToastContainer
      autoClose={3000}
      position={toast.POSITION.TOP_RIGHT}
      toastStyle={{
        backgroundColor: "#E7E6E6",
        color: "#1F4E78",
      }}
    ></ToastContainer>
  );
}

export default ContainerToast;
