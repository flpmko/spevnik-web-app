import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { confirmDialog } from "primereact/confirmdialog";

import { db } from "../firebase-config";
import HymnForm from "../components/forms/HymnForm";
import SongForm from "../components/forms/SongForm";

import "../App.css";
import "../style/songs.css";

function App() {
  const hymnsDocRef = doc(db, "index/hymns");
  const songsDocRef = doc(db, "index/songs");
  const navigate = useNavigate();
  const [hymns, setHymns] = useState([]);
  const [hymn, setHymn] = useState(null);
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Spevníkové");
  const categories = [
    { name: "Spevníkové", value: "Spevníkové" },
    { name: "Mládežnícke", value: "Mládežnícke" },
    { name: "Antifóny", value: "Antifóny" },
    { name: "Predspevy", value: "Predspevy" },
  ];

  const confirm = () => {
    console.log(categories.at(0).name);
    confirmDialog({
      message: "Naoazaj chceš vymazať túto pieseň?",
      header: "Potvrdenie",
      acceptLabel: "Áno",
      rejectLabel: "Nie",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-secondary",
      // accept: () => acceptFunc(),
      // reject: () => rejectFunc(),
    });
  };

  useEffect(() => {
    const getData = async () => {
      const hymnsData = await getDoc(hymnsDocRef);
      setHymns(hymnsData.get("all"));
      const songsData = await getDoc(songsDocRef);
      setSongs(songsData.get("all"));
    };
    getData();
  }, [hymnsDocRef, setHymns, songsDocRef, setSongs]);

  return (
    <div>
      <div className="content">
        <div className="container-song-header">
          <h1>Piesne</h1>
        </div>
        <div
          className="songs-dropdown"
          style={{
            display: "flex",
            alignItems: "center",
            paddingBottom: "20px",
            justifyContent: "space-between",
          }}
        >
          <Dropdown
            value={activeCategory}
            options={categories}
            onChange={(e) => setActiveCategory(e.value)}
            optionLabel="name"
          />
          <div>
            <Button
              id="new-song"
              label="nová pieseň"
              className="p-button-success"
              // onClick={() => navigate("/new-song")}
              onClick={() => setHymn(null)}
            ></Button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {activeCategory === categories.at(0).name ? (
            <HymnForm hymn={hymn} />
          ) : (
            <SongForm song={song} />
          )}
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
                  <div className="songs-inforow">
                    <div className="songs-button-container">
                      <Button
                        id="new-song"
                        icon="pi pi-pencil"
                        className="p-button-warning"
                        onClick={() => setHymn(hymn)}
                        style={{
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          height: "30px",
                        }}
                      ></Button>
                      <Button
                        id="new-song"
                        icon="pi pi-minus"
                        onClick={confirm}
                        style={{
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          height: "30px",
                        }}
                        className="p-button-danger"
                      ></Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
