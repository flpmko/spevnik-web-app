import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import MOCK_DATA from "../data/MOCK_DATA";

import "../App.css";
import "../style/songs.css";

function App() {
  const hymnsDocRef = doc(db, "index/hymns");
  const [hymns, setHymns] = useState([]);
  const navigate = useNavigate();

  const getSongs = async () => {
    const hymnsData = await getDoc(hymnsDocRef);
    setHymns(hymnsData.get("all"));
  };

  useEffect(() => {
    getSongs();
  }, []);

  return (
    <div>
      <div className="content">
        <div id="songs">
          <div className="container-song-header">
            <h1>Piesne</h1>
            <button id="new-song" onClick={() => navigate("/new-song")}>
              nová pieseň
            </button>
          </div>
          {hymns.map((hymn) => {
            return (
              <div key={hymn.number}>
                <h2>
                  {hymn.number} - {hymn.title}
                </h2>
                <h5 style={{ fontStyle: "italic" }}>obdobie: {hymn.season}</h5>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
