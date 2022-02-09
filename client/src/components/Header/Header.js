import React, { useState, useContext } from "react";
import { GlobalState } from "../../GlobalState";
import { AddShoppingCartIcon, MenuIcon, CloseIcon } from "../../icons";
import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import SideNav from "./SideNav";
import "./Header.css";
import logo from "../../assets/logo.png";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [openSidenav, setOpenSidenav] = useState(false);
  const onToggle = () => setOpenSidenav((prevState) => !prevState);
  const onClose = () => setOpenSidenav(false);
  const [cart] = state.userAPI.cart;

  const logoutUser = async () => {
    await axios.get("/user/logout");
    window.localStorage.removeItem("firstLogin");
    window.location.href = "/";
  };

  const adminRouter = () => {
    return (
      <span className="navbar__option-one">
        <>
          <Link to="/create_product">Create-Product</Link> /
          <Link to="/category">Categories</Link>
        </>
      </span>
    );
  };

  const loggedRouter = () => {
    return (
      <span className="navbar__option-one">
        <>
          <Link to="/history">History</Link> / {""}{" "}
          <Link to="/" onClick={logoutUser}>
            Logout
          </Link>
        </>
      </span>
    );
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__menu-wrapper" onClick={onToggle}>
          {openSidenav ? (
            <CloseIcon className="navbar__menu-icon" />
          ) : (
            <MenuIcon className="navbar__menu-icon" />
          )}
        </div>
        <Link to="/">
          {isAdmin ? (
            "ADMIN"
          ) : (
            <img src={logo} alt="amazon-logo" className="navbar__logo" />
          )}
        </Link>
        <Search />
        {isAdmin && adminRouter()}
        <div className="navbar__list">
          <div className="navbar__option navbar__link">
            {isLogged === true ? (
              loggedRouter()
            ) : (
              <span className="navbar__option-one">
                <>
                  <Link to="/signup">Signup</Link> /
                  <Link to="/login">Login</Link>
                </>
              </span>
            )}
          </div>
          {isAdmin ? (
            ""
          ) : (
            <Link to="/cart" className="navbar__link">
              <div className="navbar__option-icons">
                <div className="navbar__option-cart-number">
                  <span>{cart.length}</span>
                </div>
                <AddShoppingCartIcon className="navbar__option-cart-icon" />
              </div>
            </Link>
          )}
        </div>
      </nav>
      <SideNav
        open={openSidenav}
        onClose={onClose}
        logoutUser={logoutUser}
        isLogged={isLogged}
        isAdmin={isAdmin}
        cart={cart}
      />
    </>
  );
}

export default Header;
