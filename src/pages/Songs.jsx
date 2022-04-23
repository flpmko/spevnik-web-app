import { useState, useEffect, useMemo } from "react";
import {
  getDoc,
  doc,
  arrayRemove,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import { confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";

import { db } from "../firebase-config";
import HymnForm from "../components/forms/HymnForm";
import SongForm from "../components/forms/SongForm";
import SongItem from "../components/items/SongItem";

import "../style/songs.css";

const Songs = () => {
  //main vars
  const [hymns, setHymns] = useState([]);
  const [hymn, setHymn] = useState(null);
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);

  // db refs
  const hymnsDocRef = doc(db, "index/hymns");
  const songsDocRef = doc(db, "index/songs");
  const timesRef = doc(db, "index/timestamps");

  // pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [first, setFirst] = useState(0);
  const [totalItems, setTotalItems] = useState(hymns.length);

  // helpers
  const [loading, setLoading] = useState(false);
  const [isHymn, setIsHymn] = useState(true);
  const [query, setQuery] = useState(false);
  const [orderAscHymns, setOrderAscHymns] = useState(false);
  const [orderAscSongs, setOrderAscSongs] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Spevníkové");
  const categories = [
    { name: "Spevníkové", value: "Spevníkové" },
    { name: "Mládežnícke", value: "Mládežnícke" },
  ];

  const confirm = (songItem) => {
    confirmDialog({
      message: "Naoazaj chceš vymazať pieseň " + songItem.title + "?",
      header: "Potvrdenie",
      acceptLabel: "Vymazať",
      rejectLabel: "Zrušiť",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-secondary",
      accept: () => (isHymn ? removeHymn(songItem) : removeSong(songItem)),
      reject: () => null,
    });
  };

  const removeHymn = async (hymnPar) => {
    if (hymnPar) {
      setLoading(true);
      await updateDoc(hymnsDocRef, {
        all: arrayRemove({
          title: hymnPar.title,
          number: hymnPar.number,
          season: hymnPar.season,
        }),
      });
      await updateDoc(timesRef, {
        hymns: serverTimestamp(),
      });
      setLoading(false);
      getHymnsData();
    }
  };

  const removeSong = async (songPar) => {
    if (songPar) {
      setLoading(true);
      await updateDoc(songsDocRef, {
        all: arrayRemove({
          title: songPar.title,
          chords: songPar.chords,
          verses: songPar.verses,
        }),
      });
      await updateDoc(timesRef, {
        songs: serverTimestamp(),
      });
      setLoading(false);
      getSongsData();
    }
  };

  const resetLocalStorage = () => {
    localStorage.removeItem("title");
    localStorage.removeItem("chords");
    localStorage.removeItem("number");
    localStorage.removeItem("season");
    localStorage.removeItem("verses");
  };

  const newSongForm = () => {
    console.log("newsong");
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
    localStorage.setItem("category", e.value);
    setIsHymn(!isHymn);
    setHymn(null);
    setSong(null);
  };

  const orderHymns = () => {
    if (orderAscHymns) {
      const myData = [].concat(hymns).sort((a, b) => a.number - b.number);
      setHymns(myData);
    } else {
      const myData = [].concat(hymns).sort((a, b) => a.number + b.number);
      setHymns(myData);
    }
    setOrderAscHymns(!orderAscHymns);
  };

  const orderSongs = () => {
    if (orderAscSongs) {
      const myData = []
        .concat(songs)
        .sort((a, b) => (a.title > b.title ? 1 : -1));
      setSongs(myData);
    } else {
      const myData = []
        .concat(songs)
        .sort((a, b) => (a.title < b.title ? 1 : -1));
      setSongs(myData);
    }
    setOrderAscSongs(!orderAscSongs);
  };

  const onPageChange = (e) => {
    setFirst(e.first);
    setItemsPerPage(e.rows);
  };

  const getHymnsData = async () => {
    const data = await getDoc(hymnsDocRef);
    const hymnsObject = data.get("all").sort((a, b) => a.number - b.number);
    setHymns(hymnsObject);
  };

  const getSongsData = async () => {
    const data = await getDoc(songsDocRef);
    const songsObject = data
      .get("all")
      .sort((a, b) => (a.title > b.title ? 1 : -1));
    setSongs(songsObject);
  };

  const songsData = useMemo(() => {
    if (!isHymn) {
      let computedSongs = songs;
      if (query) {
        computedSongs = computedSongs.filter((searchSong) =>
          searchSong.title.toLowerCase().includes(query)
        );
      }
      setTotalItems(computedSongs.length);

      return computedSongs.slice(first, first + itemsPerPage);
    }
  }, [songs, first, itemsPerPage, query, isHymn]);

  const hymnsData = useMemo(() => {
    if (isHymn) {
      let computedHymns = hymns;
      if (query) {
        computedHymns = computedHymns.filter((searchHymn) =>
          searchHymn.number.toString().match(query)
        );
      }
      setTotalItems(computedHymns.length);

      return computedHymns.slice(first, first + itemsPerPage);
    }
  }, [hymns, first, itemsPerPage, query, isHymn]);

  const reload = () => {
    setLoading(true);
    getHymnsData();
    getSongsData();
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    let category = localStorage.getItem("category");
    if (!category) category = "Spevníkové";
    setActiveCategory(category);
    if (category !== "Spevníkové") {
      setIsHymn(false);
      setQuery("");
    } else {
      setIsHymn(true);
      setQuery(undefined);
    }
    getHymnsData();
    getSongsData();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>
      <div className="content">
        <div className="container-song-header">
          <h1>Piesne</h1>
        </div>
        <div className="songs-dropdown">
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
        <div className="content-holder">
          {isHymn ? (
            <HymnForm
              hymn={hymn}
              resetLocalStorage={resetLocalStorage}
              reload={reload}
            />
          ) : (
            <SongForm
              song={song}
              resetLocalStorage={resetLocalStorage}
              reload={reload}
            />
          )}
          <div
            className="songs-list p-card"
            style={{ backgroundColor: "GrayText" }}
          >
            <div className="songs-list-wrapper">
              {isHymn && (
                <div className="p-inputgroup" style={{ paddingBottom: "20px" }}>
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-search" />
                  </span>
                  <InputNumber
                    placeholder="číslo piesne"
                    value={query}
                    id="number"
                    onChange={(e) => {
                      if (e.value === null) setQuery(undefined);
                      else setQuery(e.value);
                    }}
                  />
                  <Button
                    icon={
                      orderAscHymns
                        ? "pi pi-sort-numeric-up"
                        : "pi pi-sort-numeric-down"
                    }
                    className="p-button-primary"
                    onClick={orderHymns}
                  />
                </div>
              )}
              {!isHymn && (
                <div className="p-inputgroup" style={{ paddingBottom: "20px" }}>
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-search" />
                  </span>
                  <InputText
                    placeholder="názov piesne"
                    value={query}
                    id="text"
                    onChange={(e) => {
                      if (e.target.value === null) setQuery(undefined);
                      else setQuery(e.target.value);
                    }}
                  />
                  <Button
                    icon={
                      orderAscSongs
                        ? "pi pi-sort-alpha-down"
                        : "pi pi-sort-alpha-up"
                    }
                    className="p-button-primary"
                    onClick={orderSongs}
                  />
                </div>
              )}
              {loading && (
                <ProgressSpinner
                  style={{ width: "30px", height: "30px" }}
                  strokeWidth="5"
                />
              )}
              {isHymn &&
                hymnsData.map((hymnItem) => {
                  return (
                    <SongItem
                      key={hymnItem.number}
                      isHymn={isHymn}
                      hymn={hymnItem}
                      loading={loading}
                      setHymn={setHymn}
                      confirm={confirm}
                    />
                  );
                })}
              {!isHymn &&
                songsData.map((songItem) => {
                  return (
                    <SongItem
                      key={songItem.title}
                      isHymn={isHymn}
                      song={songItem}
                      loading={loading}
                      setSong={setSong}
                      confirm={confirm}
                    />
                  );
                })}
            </div>
            <div>
              <Paginator
                first={first}
                rows={itemsPerPage}
                totalRecords={totalItems}
                onPageChange={onPageChange}
                rowsPerPageOptions={[10, 20, 30]}
                style={{ gap: "10px" }}
              ></Paginator>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Songs;
