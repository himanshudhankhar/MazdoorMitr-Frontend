import React from "react";
import { Route, Routes, Outlet } from "react-router";
import Header from './Header';
import Footer from './Footer';
import './mazdoor.css';

function MazdoorMitra() {
    return (
        <div className="mazdoor">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default MazdoorMitra;