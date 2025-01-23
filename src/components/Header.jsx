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
                <a href="/home">Home</a>
                <a href="/profile">Profile</a>
                <a href="/wallet">Wallet</a>
                <a href="">Logout</a>
            </nav>
        </header>
    )
}