import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Gestión Hotelera
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Lista de Hoteles
          </Link>
          <Link
            to="/agregar-hotel"
            className={`nav-link ${
              location.pathname === "/agregar-hotel" ? "active" : ""
            }`}
          >
            Registrar Hotel
          </Link>
        </div>

        {/* Versión móvil del título de la página */}
        <div className="current-page-title">
          {location.pathname === "/" ? "Lista de Hoteles" : "Registrar Hotel"}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
