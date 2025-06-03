import React from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '80vh',
  overflowY: 'auto',
};

export default function Modal({ children, onClose }) {
  return (
    <div style={modalStyle} onClick={onClose}>
      <div
        style={modalContentStyle}
        onClick={(e) => e.stopPropagation()} // prevent modal close on content click
      >
        <button
          onClick={onClose}
          style={{ float: 'right', fontSize: '1.2rem', cursor: 'pointer', border: 'none', background: 'none' }}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
