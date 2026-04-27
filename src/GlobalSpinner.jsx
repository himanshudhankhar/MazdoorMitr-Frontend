// GlobalSpinner.jsx
import React from "react";
import { useLoader } from "./LoaderContext";
import "./Spinner.css";

const GlobalSpinner = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="global-spinner-overlay">
      <div className="spinner" />
    </div>
  );
};

export default GlobalSpinner;