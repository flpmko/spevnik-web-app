import React, { useState } from "react";

import "./navbar.css";
import "../../style/icons.css";

const Navbar = () => {
  const [active, setActive] = useState("nav-links");
  const [burger, setBurger] = useState("burger");
  const navToggle = () => {
    active === "nav-links"
      ? setActive("nav-links nav-active")
      : setActive("nav-links");
    burger === "burger" ? setBurger("burger toggle") : setBurger("burger");
  };
  return (
    <nav>
      <div className="logo">
        <i className="logo-spevnik"></i>
        <h4>Evanjelický spevník</h4>
      </div>
      <ul className={active}>
        <li>
          <a href="/songs">Piesne</a>
        </li>
        <li>
          <a href="/users">Používatelia</a>
        </li>
        <li>
          <a href="/about">Info</a>
        </li>
      </ul>
      <div className={burger} onClick={navToggle}>
        <div className="line-1"></div>
        <div className="line-2"></div>
        <div className="line-3"></div>
      </div>
    </nav>
  );
};

export default Navbar;
