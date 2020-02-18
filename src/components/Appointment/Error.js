
import React from "react";

const Error = ({ message, onClose }) => {
  return (
    <main className="appointment__card appointment__card--error">
      <section className="appointment__error-message">
        <h1 className="text--semi-bold">Error</h1>
        <h3 className="text--light">{message}</h3>
      </section>
      <img
        onClick={onClose}
        className="appointment__error-close"
        src="images/close.png"
        alt="Close"
      />
    </main>
  );
};

export default Error;