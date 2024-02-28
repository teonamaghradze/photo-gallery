import { useState } from "react";
import "./Modal.scss";

function Modal({ children }: any) {
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="overlay">
      {/* <button onClick={onClose}>X</button> */}
      <div className="modal">{children}</div>
    </div>
  );
}

export default Modal;
