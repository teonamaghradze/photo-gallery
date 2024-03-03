import { ModalProps } from "../interfaces/modal_interfaces";
import "./Modal.scss";

function Modal({ children }: ModalProps) {
  return (
    <div className="overlay">
      <div className="modal">{children}</div>
    </div>
  );
}

export default Modal;
