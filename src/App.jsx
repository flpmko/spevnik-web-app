import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Songs from "./pages/Songs";
import Users from "./pages/Users";
import Home from "./pages/Home";
import NewSong from "./pages/NewSong";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/songs" element={<Songs />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/new-song" element={<NewSong />}></Route>
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
