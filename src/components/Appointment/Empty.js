//Empty allows a user to choose which time slot to book.

import React from "react";

const Empty = ({ onAdd }) => {
  return (
    <main className="appointment__add">
      <img
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        onClick={onAdd}
      />
    </main>
  );
};

export default Empty;