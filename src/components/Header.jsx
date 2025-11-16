import React from "react";
import { NavLink } from "react-router-dom";
import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <h1>MazdoorMitr</h1>
      </div>
      <nav className="header-nav">
        <NavLink to="/app/home" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
        <NavLink to="/app/profile" className={({isActive}) => isActive ? "active" : ""}>Profile</NavLink>
        <NavLink to="/app/wallet" className={({isActive}) => isActive ? "active" : ""}>Wallet</NavLink>
        <NavLink to="/app/shop-dashboard" className={({isActive}) => isActive ? "active" : ""}>Shops</NavLink>
        <NavLink to="/app/marketplace" className={({isActive}) => isActive ? "active" : ""}>Marketplace</NavLink>
        <a href="/logout">Logout</a>
      </nav>
    </header>
  );
}
