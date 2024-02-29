import React from "react";
import { Link } from "react-router-dom";

function HistoryPage() {
  return (
    <div>
      <Link to="/">go back</Link>
      <h1>History page</h1>
    </div>
  );
}

export default HistoryPage;
