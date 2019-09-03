import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div className="Navbar">
      {isAuthenticated && (
        <>
          <Link to="/" className="Navbar__HomeLink">
            Home
          </Link>
          <Link to="/profile" className="Navbar__ProfileLink">
            Profile
          </Link>
        </>
      )}
      {!isAuthenticated && (
        <button className="Navbar__login" onClick={() => loginWithRedirect({})}>
          Login
        </button>
      )}
      {isAuthenticated && (
        <button className="Navbar__logout" onClick={() => logout()}>
          Logout
        </button>
      )}
    </div>
  );
};

export default NavBar;
