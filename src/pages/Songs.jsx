import { useState, useEffect } from "react";
import { getDoc, doc, arrayRemove, updateDoc } from "firebase/firestore";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { confirmDialog } from "primereact/confirmdialog";

import { db } from "../firebase-config";
import HymnForm from "../components/forms/HymnForm";
import SongForm from "../components/forms/SongForm";
import SongItem from "../components/items/SongItem";

import "../App.css";
import "../style/songs.css";

function App() {
  // old data from local storage
  const oldHymns = JSON.parse(localStorage.getItem("hymns"));
  const oldSongs = JSON.parse(localStorage.getItem("songs"));
  // const oldHymns = null;
  // const oldSongs = null;

  //main vars
  const [hymns, setHymns] = useState(oldHymns ? oldHymns : []);
  const [hymn, setHymn] = useState(null);
  const [songs, setSongs] = useState(oldSongs ? oldSongs : []);
  const [song, setSong] = useState(null);
  // const [songs, setSongs] = useState([]);
  // const [hymns, setHymns] = useState([]);

  // db refs
  const hymnsDocRef = doc(db, "index/hymns");
  const songsDocRef = doc(db, "index/songs");

  // helpers
  const [loading, setLoading] = useState(false);
  const [isHymn, setIsHymn] = useState(true);
  const [query, setQuery] = useState(undefined);
  const [orderAscending, setOrderAscending] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Spevníkové");
  const categories = [
    { name: "Spevníkové", value: "Spevníkové" },
    { name: "Mládežnícke", value: "Mládežnícke" },
    { name: "Antifóny", value: "Antifóny" },
    { name: "Predspevy", value: "Predspevy" },
  ];

  const confirm = () => {
    let outcome = false;
    confirmDialog({
      message: "Naoazaj chceš vymazať túto pieseň?",
      header: "Potvrdenie",
      acceptLabel: "Áno",
      rejectLabel: "Nie",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-secondary",
      accept: () => (outcome = true),
      reject: () => (outcome = false),
    });
    console.log(outcome);
    return outcome;
  };

  const removeHymn = async (hymn) => {
    if (hymn) {
      if (confirm()) {
        setLoading(true);
        await updateDoc(hymnsDocRef, {
          all: arrayRemove({
            title: hymn.title,
            number: hymn.number,
            season: hymn.season,
            verses: hymn.verses,
          }),
        });
        setLoading(false);
      }
    }
  };

  const resetLocalStorage = () => {
    localStorage.removeItem("title");
    localStorage.removeItem("number");
    localStorage.removeItem("season");
    localStorage.removeItem("verses");
  };

  const newSongForm = () => {
    resetLocalStorage();
    setHymn(null);
    setSong(null);
  };

  const changeCategory = (e) => {
    setActiveCategory(e.value);
    if (e.value === "Spevníkové") {
      setQuery(undefined);
    } else {
      setQuery("");
    }
    setIsHymn(!isHymn);
    setHymn(null);
    setSong(null);
  };

  useEffect(() => {
    if (!oldHymns) {
      const getHymnsData = async () => {
        const hymnsData = await getDoc(hymnsDocRef);
        setHymns(hymnsData.get("all"));
        localStorage.setItem("hymns", JSON.stringify(hymnsData.get("all")));
      };
      getHymnsData();
    }
    if (!oldSongs) {
      const getSongsData = async () => {
        const songsData = await getDoc(songsDocRef);
        setSongs(songsData.get("all"));
        localStorage.setItem("songs", JSON.stringify(songsData.get("all")));
      };
      getSongsData();
    }
  }, []);

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
            onChange={(e) => changeCategory(e)}
            optionLabel="name"
          />
          <div>
            <Button
              id="new-song"
              label="nová pieseň"
              className="p-button-success"
              onClick={newSongForm}
            ></Button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {activeCategory === categories.at(0).name ? (
            <HymnForm hymn={hymn} resetLocalStorage={resetLocalStorage} />
          ) : (
            <SongForm song={song} resetLocalStorage={resetLocalStorage} />
          )}
          <div
            className="songs-list p-card"
            style={{ backgroundColor: "GrayText", minWidth: "450px" }}
          >
            {isHymn && (
              <div className="p-inputgroup" style={{ paddingBottom: "20px" }}>
                <Button
                  icon={
                    orderAscending
                      ? "pi pi-sort-numeric-down"
                      : "pi pi-sort-numeric-up"
                  }
                  className="p-button-primary"
                  onClick={() => setOrderAscending(!orderAscending)}
                />
                <InputNumber
                  placeholder="číslo piesne"
                  value={query}
                  id="number"
                  onChange={(e) => {
                    if (e.value === null) setQuery(undefined);
                    else setQuery(e.value);
                  }}
                />
                <Button icon="pi pi-search" className="p-button-primary" />
              </div>
            )}
            {!isHymn && (
              <div className="p-inputgroup" style={{ paddingBottom: "20px" }}>
                <Button
                  icon={
                    orderAscending
                      ? "pi pi-sort-alpha-down"
                      : "pi pi-sort-alpha-up"
                  }
                  className="p-button-primary"
                  onClick={() => setOrderAscending(!orderAscending)}
                />
                <InputText
                  placeholder="názov piesne"
                  value={query}
                  id="text"
                  onChange={(e) => {
                    if (e.target.value === null) setQuery(undefined);
                    else setQuery(e.target.value);
                  }}
                />
                <Button icon="pi pi-search" className="p-button-primary" />
              </div>
            )}
            {isHymn &&
              hymns
                .filter((searchHymn) =>
                  searchHymn.number.toString().match(query)
                )
                .map((hymn) => {
                  return (
                    <SongItem
                      key={hymn.number}
                      isHymn={isHymn}
                      hymn={hymn}
                      loading={loading}
                      setHymn={setHymn}
                      removeHymn={removeHymn}
                    />
                  );
                })}
            {!isHymn &&
              songs
                .filter((searchSong) => searchSong.title.includes(query))
                .map((song) => {
                  return (
                    <SongItem
                      key={song.title}
                      isHymn={isHymn}
                      song={song}
                      loading={loading}
                      setSong={setSong}
                      removeHymn={removeHymn}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
