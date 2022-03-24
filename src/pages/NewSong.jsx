import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Chips } from "primereact/chips";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";

import { db } from "../firebase-config";

import "../App.css";
import "../style/newSong.css";

function NewSong() {
  const [title, setTitle] = useState("");
  const [season, setSeason] = useState("");
  const [number, setNumber] = useState();
  const [chords, setChords] = useState([]);
  const [verses, setVerses] = useState([{ text: "" }]);
  const [category, setCategory] = useState("Spevníková");
  const songsCollectionRef = collection(db, "songs");
  const options = ["Spevníková", "Mládežnícka"];
  const seasons = [
    { name: "Advent", code: "Advent" },
    { name: "Vianoce", code: "Vianoce" },
    { name: "Pôst", code: "Pôst" },
    { name: "Veľká noc", code: "Veľká noc" },
    { name: "Vstúpenie", code: "Vstúpenie" },
    { name: "Zoslanie", code: "Zoslanie" },
    { name: "Trojjediný", code: "Trojjediný" },
    { name: "Cirkev", code: "Cirkev" },
  ];

  const createSong = async () => {
    await addDoc(songsCollectionRef, {
      title: title,
      chords: chords,
      verses: verses,
    });
  };

  const createHymn = async () => {
    await addDoc(songsCollectionRef, {
      title: title,
      number: number,
      season: season,
      verses: verses,
    });
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
    category === "Spevníková" ? createHymn() : createSong();
    window.location.href = "/songs";
  };

  return (
    <div className="content">
      <div className="new-song-header">
        <h1>Nová pieseň</h1>
        <SelectButton
          value={category}
          options={options}
          onChange={(e) => setCategory(e.value)}
        />
      </div>
      {category && (
        <div className="p-card new-song-container">
          <div className="new-song-line">
            <h2>Info</h2>
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
            {category === "Spevníková" && (
              <span className="p-float-label">
                <InputNumber
                  placeholder="Číslo piesne"
                  inputId="integeronly"
                  value={number}
                  onChange={(e) => setNumber(e.value)}
                />
              </span>
            )}
            {category === "Spevníková" && (
              <Dropdown
                value={season}
                options={seasons}
                onChange={(e) => setSeason(e.value)}
                optionLabel="name"
                placeholder="Vyber obdobie"
              />
            )}
          </div>
          {category === "Mládežnícka" && (
            <div className="new-song-line">
              <Chips
                placeholder="Akordy"
                value={chords}
                onChange={(e) => setChords(e.value)}
                separator=","
              />
            </div>
          )}
          <div className="new-song-line">
            <h2>Text piesne</h2>
          </div>
          {verses.map((item, i) => (
            <div className="new-song-line">
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
      )}
      <div className="new-song-intermezzo">
        <div></div>
        <p>ALEBO</p>
        <div></div>
      </div>
      <div className="new-song-container new-song-file p-card">
        <span>Nahrať pieseň zo súboru </span>
        <FileUpload name="demo" url="./upload" mode="basic" accept=".txt" />
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

export default NewSong;
