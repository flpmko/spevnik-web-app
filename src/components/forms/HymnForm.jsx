import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

import "../../App.css";
import "../../style/newSong.css";

function HymnForm({ hymn }) {
  const [title, setTitle] = useState("");
  const [season, setSeason] = useState("");
  const [number, setNumber] = useState();
  const [verses, setVerses] = useState([""]);
  const seasons = [
    { name: "Advent", value: "Advent" },
    { name: "Vianoce", value: "Vianoce" },
    { name: "Pôst", value: "Pôst" },
    { name: "Veľká noc", value: "Veľká noc" },
    { name: "Vstúpenie", value: "Vstúpenie" },
    { name: "Zoslanie", value: "Zoslanie" },
    { name: "Trojjediný", value: "Trojjediný" },
    { name: "Cirkev", value: "Cirkev" },
  ];

  const createHymn = async () => {
    // await addDoc(songsCollectionRef, {
    //   title: title,
    //   number: number,
    //   season: season,
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

  const handleSubmit = () => {
    // category === "Spevníková" ? createHymn() : createSong();
    // window.location.href = "/songs";
  };

  const resetState = () => {
    setTitle("");
    setSeason("");
    setNumber();
    setVerses([""]);
  };

  useEffect(() => {
    if (hymn) {
      setTitle(hymn.title);
      setSeason(hymn.season);
      setNumber(hymn.number);
      setVerses(hymn.verses);
    } else {
      resetState();
    }
  }, [hymn]);

  return (
    <div>
      <div className="p-card new-song-container">
        <div className="new-song-line">
          <h2>{hymn ? "Upraviť pieseň" : "Nová pieseň"}</h2>
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
          <span className="p-float-label">
            <InputNumber
              inputId="integeronly"
              value={number}
              id="number"
              onChange={(e) => setNumber(e.value)}
            />
            <label htmlFor="number">Číslo piesne</label>
          </span>
          <Dropdown
            value={season}
            options={seasons}
            onChange={(e) => setSeason(e.value)}
            optionLabel="name"
            placeholder="Vyber obdobie"
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
          className="p-button-success"
          onClick={handleSubmit}
        >
          VYTVORIŤ
        </Button>
      </div>
    </div>
  );
}

export default HymnForm;
