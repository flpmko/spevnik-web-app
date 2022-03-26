import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

import { useUserAuth } from '../../context/UserContext';

import '../../style/navbar.css';
import '../../style/icons.css';

const Navbar = () => {
  const [active, setActive] = useState('nav-links');
  const [burger, setBurger] = useState('burger');
  const { currentUser, logout } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
  };

  const navToggle = () => {
    active === 'nav-links'
      ? setActive('nav-links nav-active')
      : setActive('nav-links');
    burger === 'burger' ? setBurger('burger toggle') : setBurger('burger');
  };

  return (
    <nav>
      <div className="logo">
        <i className="logo-spevnik"></i>
        <h4>Evanjelický spevník</h4>
      </div>
      <ul
        className={active}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {currentUser && <li>{currentUser.email}</li>}
        {currentUser && (
          <li>
            <Button label="Odhlásiť" icon="pi pi-user" onClick={handleLogout} />
          </li>
        )}
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
