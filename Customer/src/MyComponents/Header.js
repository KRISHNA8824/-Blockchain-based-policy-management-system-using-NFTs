import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function Header(props) {
  const [listItemText, setListItemText] = useState('Login');
  useEffect(() => {
    {(localStorage.getItem("user") === null || localStorage.getItem("user") === "null") ? handleListItemClick("Login") : handleListItemClick("Logout");}
    // if(localStorage.getItem("user") === null || localStorage.getItem("user") === "null") console.log("null");
    // else console.log(localStorage.getItem("user"));
  }, [localStorage.getItem("user")]);

  function handleListItemClick(text) {
    setListItemText(text);
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">{props.title}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Policies list</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/myPolicies">My Policies</Link>
            </li>
          </ul>
          <div className="d-flex" role="search">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">

                {
                  (localStorage.getItem("user") === null || localStorage.getItem("user") === "null") ? <Link className="nav-link" to="/login"> {listItemText} </Link> : 
                  <Link className="nav-link" onClick={()=> {localStorage.setItem("user", JSON.stringify(null)); localStorage.setItem("token", JSON.stringify(null)); handleListItemClick("Login");}} to = "/login"> {listItemText} </Link>
                }

              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

