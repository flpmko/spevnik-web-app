import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { db } from "../firebase-config";

import "../App.css";
import "../style/songs.css";

function App() {
  const hymnsDocRef = doc(db, "index/hymns");
  const navigate = useNavigate();
  const [hymns, setHymns] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Spevníkové");
  const categories = [
    { name: "Spevníkové", code: "Spevníkové" },
    { name: "Mládežnícke", code: "Mládežnícke" },
    { name: "Antifóny", code: "Antifóny" },
    { name: "Predspevy", code: "Predspevy" },
  ];

  useEffect(() => {
    const getSongs = async () => {
      const hymnsData = await getDoc(hymnsDocRef);
      setHymns(hymnsData.get("all"));
    };
    getSongs();
  }, [hymnsDocRef, setHymns]);

  return (
    <div>
      <div className="content">
        <div className="container-song-header">
          <h1>Piesne</h1>
          <div>
            <Button
              id="new-song"
              label="nová pieseň"
              className="p-button-success"
              onClick={() => navigate("/new-song")}
            ></Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
            paddingBottom: "20px",
          }}
        >
          <Dropdown
            value={activeCategory}
            options={categories}
            onChange={(e) => setActiveCategory(e.value)}
            optionLabel="name"
          />
        </div>
        <div
          className="songs-list p-card"
          style={{ backgroundColor: "GrayText" }}
        >
          {hymns.map((hymn) => {
            return (
              <div key={hymn.number} className="songs-list-item p-card">
                <h2>
                  {hymn.number} - {hymn.title}
                </h2>
                <span className="songs-season">obdobie: {hymn.season}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
