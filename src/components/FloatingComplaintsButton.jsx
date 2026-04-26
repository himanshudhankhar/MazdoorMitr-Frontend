import React from "react";
import { useNavigate } from "react-router-dom";
import "./FloatingComplaintsButton.css";

const FloatingComplaintsButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="complaints-floating-btn"
      onClick={() => navigate("/app/complaints")}
    >
      Support and Complaints
    </button>
  );
};

export default FloatingComplaintsButton;