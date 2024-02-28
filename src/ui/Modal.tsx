import "./Modal.scss";

function Modal({ children, onClose }: any) {
  return (
    <div className="overlay">
      {/* <button onClick={onClose}>X</button> */}
      <div className="modal">{children}</div>;
    </div>
  );
}

export default Modal;
