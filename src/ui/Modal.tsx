import "./Modal.scss";

function Modal({ children }: any) {
  return (
    <div className="overlay">
      <button>X</button>
      <div className="modal">{children}</div>
    </div>
  );
}

export default Modal;
