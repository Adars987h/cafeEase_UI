import React, { useState } from "react";
import "../../CSS/Modal.css";
import { FiX } from "react-icons/fi";

const BillModal = ({ pdfBlob, onClose }) => {
  const [url, setUrl] = useState(null);

  React.useEffect(() => {
    if (pdfBlob) {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setUrl(pdfUrl);
      return () => URL.revokeObjectURL(pdfUrl);
    }
  }, [pdfBlob]);

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content modal-content--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Bill</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close"><FiX /></button>
        </div>
        <div className="modal-body modal-body--flush">
          {url && <embed src={url} type="application/pdf" width="100%" height="640px" />}
        </div>
      </div>
    </div>
  );
};

export default BillModal;
