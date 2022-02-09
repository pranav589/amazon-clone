import React from "react";
import { NavLink, Link } from "react-router-dom";

import {
  HomeIcon,
  ShoppingCartIcon,
  WebIcon,
  LockOpenIcon,
  VpnKeyIcon,
  ExitToAppIcon,
  CreateIcon,
} from "../../icons";

import "./SideNav.css";

const SideNav = ({
  open,
  onClose,
  cart,
  logoutUser,
  isLogged,
  isAdmin,
}) => {
  const sideLinks = (
    <div className="sidenav__links">
      <Link to="/" className="sidenav__link" onClick={() => onClose()}>
        <HomeIcon /> Home
      </Link>
      {!isAdmin ? (
        <NavLink
          to="/cart"
          activeclassname="active__link"
          className="sidenav__link"
          onClick={() => onClose()}
        >
          <ShoppingCartIcon /> Cart
          <span>{cart.length}</span>
        </NavLink>
      ) : (
        ""
      )}
      <NavLink
        activeclassname="active__link"
        to="/history"
        className="sidenav__link"
        onClick={() => onClose()}
      >
        <WebIcon /> History
      </NavLink>

      {isAdmin ? (
        <NavLink
          to="/create_product"
          className="sidenav__link"
          onClick={() => {
            onClose();
          }}
        >
          <CreateIcon />
          Create Product
        </NavLink>
      ) : (
        ""
      )}

      {isAdmin ? (
        <NavLink
          to="/category"
          className="sidenav__link"
          onClick={() => {
            onClose();
          }}
        >
          <CreateIcon />
          Category
        </NavLink>
      ) : (
        ""
      )}

      {isLogged ? (
        ""
      ) : (
        <NavLink
          activeclassname="active__link"
          to="/login"
          className="sidenav__link"
          onClick={() => onClose()}
        >
          <VpnKeyIcon /> Login
        </NavLink>
      )}
      {isLogged ? (
        ""
      ) : (
        <NavLink
          activeclassname="active__link"
          to="/signup"
          className="sidenav__link"
          onClick={() => onClose()}
        >
          <LockOpenIcon />
          Signup
        </NavLink>
      )}

      {isLogged || isAdmin ? (
        <NavLink
          to="/"
          className="sidenav__link"
          onClick={() => {
            onClose();
            logoutUser();
          }}
        >
          <ExitToAppIcon />
          Logout
        </NavLink>
      ) : (
        ""
      )}
    </div>
  );
  return (
    <nav className={`sidenav ${open && "sidenav__open"}`}>
      {sideLinks}
      <div className="sidenav__overlay" onClick={() => onClose()}></div>
    </nav>
  );
};

export default SideNav;
