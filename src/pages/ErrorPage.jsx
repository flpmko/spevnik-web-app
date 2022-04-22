import React from "react";
import "../style/errorPage.css";
import "../style/icons.css";

const ErrorPage = () => {
  return (
    <div className="container">
      <i className="error"></i>
      <p>404</p>
      <h1 className="MainTitle">Táto stránka neexistuje.</h1>
      <h3>
        poď späť <a href="/spevnik-web-app/">domov</a>
      </h3>
    </div>
  );
};

export default ErrorPage;
