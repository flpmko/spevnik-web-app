import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Chips } from "primereact/chips";
import { Button } from "primereact/button";

import "../../App.css";
import "../../style/newSong.css";

function SongForm({ song }) {
  const [title, setTitle] = useState("");
  const [chords, setChords] = useState([""]);
  const [verses, setVerses] = useState([""]);

  const createSong = async () => {
    // await addDoc(songsCollectionRef, {
    //   title: title,
    //   chords: chords,
    //   verses: verses,
    // });
  };

  // handle input change on verses
  const handleInputChange = (e, index) => {
    const { text, value } = e.target;
    const list = [...verses];
    list[index][text] = value;
    setVerses(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...verses];
    list.splice(index, 1);
    setVerses(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setVerses([...verses, { text: "" }]);
  };

  const handleClick = () => {
    // category === "Spevníková" ? createHymn() : createSong();
    // window.location.href = "/songs";
  };

  const resetState = () => {
    setTitle("");
    setChords([""]);
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
  }, [song]);

  return (
    <div>
      <div className="p-card new-song-container">
        <div className="new-song-line">
          <h2>Nová pieseň</h2>
        </div>
        <div className="new-song-line">
          <span className="p-float-label">
            <InputText
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="title">Názov piesne</label>
          </span>
        </div>
        <div className="new-song-line">
          <Chips
            placeholder="Akordy"
            value={chords}
            onChange={(e) => setChords(e.value)}
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
              value={item.text}
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
          className="p-button-success"
          onClick={handleClick}
        >
          VYTVORIŤ
        </Button>
      </div>
    </div>
  );
}

export default SongForm;
