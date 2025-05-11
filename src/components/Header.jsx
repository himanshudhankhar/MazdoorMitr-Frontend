import React from 'react';
import { NavLink } from "react-router";
import './header.css';

export default function Header() {
    return (
        <header class="header">
            <div class="header-brand">
                <h1>MazdoorMitr</h1>
            </div>
            <nav class="header-nav">
                <a href="/app/home">Home</a>
                <a href="/app/profile">Profile</a>
                <a href="/app/wallet">Wallet</a>
                <a href="">Logout</a>
            </nav>
        </header>
    )
}