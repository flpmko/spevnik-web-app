import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Songs from "./pages/Songs";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import PrivateRoute from "./components/navigation/PrivateRoute";

import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import "./style/App.css";

import PrimeReact from "primereact/api";
import { UserContextProvider } from "./context/UserContext";

PrimeReact.ripple = true;

const App = () => {
  return (
    <Router>
      <UserContextProvider>
        <Navbar />
        <Routes>
          <Route
            path="/spevnik-web-app/"
            element={
              <PrivateRoute>
                <Songs />
              </PrivateRoute>
            }
          ></Route>
          <Route path="/spevnik-web-app/login" element={<Login />}></Route>
          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
      </UserContextProvider>
    </Router>
  );
};

export default App;
