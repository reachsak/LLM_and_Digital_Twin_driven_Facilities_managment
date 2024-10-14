import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import "./NavBar.css";
import "./logo.png";
import { CodeIcon, HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";
import "react-awesome-button/dist/styles.css";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";

function Header({ isConnected, connectToMetamask }) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const handleClickk = () => {
    connectToMetamask();
  };
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            <span className="icon">
              <img src={require("./logo.png")} alt="Logo" />
            </span>
            <span className="text">Smart Building's DAO</span>
            {/* <i className="fas fa-code"></i> */}
            <span className="icon">
              <CodeIcon />
            </span>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/governance"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Governance
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/member"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Member
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/treasury"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Treasury
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/user"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                User
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/digitaltwin"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Digital Twin
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                exact
                to="/buildingcontrol"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                AI Agent
              </NavLink>
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {/* <i className={click ? "fas fa-times" : "fas fa-bars"}></i> */}

            {click ? (
              <span className="icon">
                <HamburgetMenuOpen />{" "}
              </span>
            ) : (
              <span className="icon">
                <HamburgetMenuClose />
              </span>
            )}
          </div>
          {!isConnected ? (
            <AwesomeButton type="primary" onPress={connectToMetamask}>
              Connect Wallet
            </AwesomeButton>
          ) : (
            <AwesomeButton variant="outlined" disabled>
              Connected
            </AwesomeButton>
          )}
        </div>
      </nav>
    </>
  );
}

export default Header;
