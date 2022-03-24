import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { SelectButton } from "primereact/selectbutton";

import { db } from "../firebase-config";

import "../App.css";
import "../style/newSong.css";

function NewSong() {
  const [songName, setSongName] = useState("");
  const [songCategory, setSongCategory] = useState("Spevníková");
  const [songText, setSongText] = useState("");
  const options = ["Spevníková", "Mládežnícka"];

  const songsCollectionRef = collection(db, "songs");
  const createSong = async () => {
    await addDoc(songsCollectionRef, {
      name: songName,
      category: songCategory,
      text: songText,
    });
  };
  const handleClick = () => {
    createSong();
    window.location.href = "/songs";
  };

  return (
    <div className="content">
      <div>
        <h1>Nová pieseň</h1>
        <SelectButton
          value={songCategory}
          options={options}
          onChange={(e) => setSongCategory(e.value)}
        />
      </div>
      <div className="new-song-container">
        <div className="new-song-line">
          <label htmlFor="song-name">Názov piesne:</label>
          <input
            type="text"
            name="song-name"
            id="song-name"
            placeholder="Hodný si"
            onChange={(e) => {
              setSongName(e.target.value);
            }}
          />
        </div>
        <div className="new-song-line">
          <label htmlFor="song-category">Kategória piesne:</label>
          <select
            name="song-category"
            id="song-category"
            onChange={(e) => {
              setSongCategory(e.target.value);
            }}
          >
            <option value="" hidden>
              vybrať
            </option>
            <option value="hymn">spevníková</option>
            <option value="modern">mládežnícka</option>
          </select>
        </div>
        <div className="new-song-line">
          <label htmlFor="song-text">Text piesne:</label>
          <textarea
            id="song-text"
            name="song-text"
            rows="8"
            cols="60"
            placeholder="text piesne"
            onChange={(e) => {
              setSongText(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="new-song-intermezzo">
        <div></div>
        <p>ALEBO</p>
        <div></div>
      </div>
      <div className="new-song-container">
        <div className="new-song-line">
          <label htmlFor="song-name">Pieseň zo súboru:</label>
          <input type="file" accept=".txt" name="song-file" id="song-file" />
        </div>
      </div>
      <div className="submit">
        <button id="new-song" onClick={handleClick}>
          VYTVORIŤ
        </button>
      </div>
    </div>
  );
}

export default NewSong;
