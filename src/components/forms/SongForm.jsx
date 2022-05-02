import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Chips } from "primereact/chips";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  doc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase-config";

import "../../style/newSong.css";

const SongForm = ({ song, songs, resetLocalStorage, reload }) => {
  // data from local storage
  const oldTitle = localStorage.getItem("title");
  const oldChords = JSON.parse(localStorage.getItem("chords"));

  // main vars
  const [title, setTitle] = useState(oldTitle ? oldTitle : "");
  const [chords, setChords] = useState(oldChords ? oldChords : []);
  const [verses, setVerses] = useState([""]);

  // helper vars
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const songsRef = doc(db, "index/songs");
  const timesRef = doc(db, "index/timestamps");
  const toast = useRef();

  // handle input change on verses
  const handleInputChange = (e, index) => {
    const { value } = e.target;
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

  const showToast = (severity, summary, message) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  const createSong = async () => {
    setLoading(true);
    let exists = false;
    songs.every((el) => {
      if (el.title === title) {
        exists = true;
        showToast("error", "Chyba", "Pieseň " + title + " už existuje!");
        return false;
      }
      return true;
    });
    if (!exists) {
      try {
        await updateDoc(songsRef, {
          all: arrayUnion({
            title: title,
            chords: chords,
            verses: verses,
          }),
        }).then(reload());
        await updateDoc(timesRef, {
          songs: serverTimestamp(),
        });
        resetLocalStorage();
        resetState();
        showToast(
          "success",
          "Hotovo",
          "Pieseň " + title + " bola úspešne pridaná do databázy."
        );
      } catch (e) {
        showToast("error", "Chyba", e);
      }
    }
    setLoading(false);
  };

  const updateSong = async () => {
    setLoading(true);
    try {
      await updateDoc(songsRef, {
        all: arrayRemove({
          title: song.title,
          chords: song.chords,
          verses: song.verses,
        }),
      });
      createSong();
    } catch (e) {
      showToast("error", "Chyba", e);
    }

    setLoading(false);
  };

  const renderErrorMessage = (message) => {
    return (
      <Message severity="error" text={message} style={{ marginLeft: "20px" }} />
    );
  };

  const validate = () => {
    if (title === "" || title === null) {
      setShowMsg(true);
      return false;
    }
    return true;
  };

  const handleSubmitClick = () => {
    if (validate()) {
      song ? updateSong() : createSong();
    }
  };

  const submitText = () => {
    let text;
    if (song) {
      text = "upraviť";
    } else {
      text = "vytvoriť";
    }
    return text;
  };

  const resetState = () => {
    setTitle("");
    setChords([]);
    setVerses([""]);
  };

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setChords(song.chords);
      setVerses(song.verses);
    } else {
      resetState();
    }
    // eslint-disable-next-line
  }, [song]);

  return (
    <div>
      <Toast ref={toast} />
      <div className="p-card new-song-container">
        <div className="new-song-line">
          <h2>{song ? "Upraviť pieseň" : "Nová pieseň"}</h2>
          {showMsg && renderErrorMessage("Názov piesne je povinný!")}
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
              localStorage.setItem("chords", JSON.stringify(e.value));
            }}
            separator=","
            style={{ maxWidth: "233px" }}
          />
        </div>
        <div className="new-song-line">
          <h2>Text piesne</h2>
        </div>
        {verses.map((item, i) => (
          <div className="new-song-line" key={i}>
            <span>{i + 1}</span>
            <div className="new-song-verse">
              <InputTextarea
                value={item}
                placeholder="Text piesne"
                onChange={(e) => handleInputChange(e, i)}
                rows={5}
                cols={30}
                className="input-textarea"
                autoResize
              />
              <div className="new-song-buttons">
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
            </div>
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
};

export default SongForm;
