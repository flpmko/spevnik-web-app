import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Chips } from "primereact/chips";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  doc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase-config";

import "../../App.css";
import "../../style/newSong.css";

function SongForm({ song, resetLocalStorage }) {
  const oldTitle = localStorage.getItem("title");
  const oldChords = localStorage.getItem("chords");
  //   const oldVerses = JSON.parse(localStorage.getItem("verses"));
  const [title, setTitle] = useState(oldTitle ? oldTitle : "");
  const [chords, setChords] = useState(oldChords ? oldChords : []);
  const [verses, setVerses] = useState([""]);
  const [loading, setLoading] = useState(false);
  const songsRef = doc(db, "index/songs");

  // handle input change on verses
  const handleInputChange = (e, index) => {
    const { text, value } = e.target;
    const list = [...verses];
    list[index] = value;
    setVerses(list);
    localStorage.setItem("verses", JSON.stringify(list));
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...verses];
    list.splice(index, 1);
    setVerses(list);
    localStorage.setItem("verses", JSON.stringify(list));
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setVerses([...verses, [""]]);
    localStorage.setItem("verses", JSON.stringify(verses));
  };

  const createSong = async () => {
    setLoading(true);
    await updateDoc(songsRef, {
      all: arrayUnion({
        title: title,
        chords: chords,
        verses: verses,
      }),
    });
    await updateDoc(songsRef, {
      lastChange: serverTimestamp(),
    });
    resetLocalStorage();
    resetState();
    setLoading(false);
  };

  const updateSong = async () => {
    setLoading(true);
    await updateDoc(songsRef, {
      all: arrayRemove({
        title: song.title,
        chords: song.chords,
        verses: song.verses,
      }),
    });
    createSong();
    setLoading(false);
  };

  const handleSubmitClick = () => {
    song ? createSong() : updateSong();
  };

  const submitText = () => {
    let text;
    song ? (text = "upraviť") : (text = "vytvoriť");
    return text;
  };

  const resetState = () => {
    if (oldTitle === null) setTitle();
    if (oldChords === null) setChords([]);
    setVerses([""]);
  };

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setVerses(song.chords);
      setVerses(song.verses);
    } else {
      resetState();
    }
  }, []);

  return (
    <div>
      <div className="p-card new-song-container">
        <div className="new-song-line">
          <h2>{song ? "Upraviť pieseň" : "Nová pieseň"}</h2>
        </div>
        <div className="new-song-line">
          <span className="p-float-label">
            <InputText
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                localStorage.setItem("title", e.target.value);
              }}
            />
            <label htmlFor="title">Názov piesne</label>
          </span>
        </div>
        <div className="new-song-line">
          <Chips
            placeholder="Akordy"
            value={chords}
            onChange={(e) => {
              setChords(e.value);
              console.log(chords);
              localStorage.setItem("chords", e.value);
            }}
            separator=","
          />
        </div>
        <div className="new-song-line">
          <h2>Text piesne</h2>
        </div>
        {verses.map((item, i) => (
          <div className="new-song-line" key={i}>
            <span>{i + 1}</span>
            <InputTextarea
              value={item}
              placeholder="Text piesne"
              onChange={(e) => handleInputChange(e, i)}
              rows={5}
              cols={30}
              autoResize
            />
            {verses.length !== 1 && (
              <Button
                className="new-song-button p-button-danger"
                icon="pi pi-minus"
                onClick={() => handleRemoveClick(i)}
              ></Button>
            )}
            {verses.length - 1 === i && (
              <Button
                icon="pi pi-plus"
                className="new-song-button p-button-success"
                onClick={handleAddClick}
              ></Button>
            )}
          </div>
        ))}
      </div>
      <div className="new-song-submit">
        <Button
          id="new-song"
          style={{ minWidth: "120px" }}
          className="p-button-success"
          onClick={handleSubmitClick}
        >
          {loading ? (
            <ProgressSpinner
              style={{ width: "30px", height: "30px" }}
              strokeWidth="5"
            />
          ) : (
            submitText()
          )}
        </Button>
      </div>
    </div>
  );
}

export default SongForm;
