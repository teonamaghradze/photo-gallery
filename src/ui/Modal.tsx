import "./Modal.scss";

function Modal({ children }: any) {
  return (
    <div className="overlay">
      <div className="modal">{children}</div>
    </div>
  );
}

export default Modal;
