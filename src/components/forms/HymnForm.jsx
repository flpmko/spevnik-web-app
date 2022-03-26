import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import {
  doc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import { db } from '../../firebase-config';

// import '../../App.css';
import '../../style/newSong.css';

const HymnForm = ({ hymn, resetLocalStorage }) => {
  // data from local storage
  const oldTitle = localStorage.getItem('title');
  const oldNumber = localStorage.getItem('number');
  const oldSeason = localStorage.getItem('season');
  //   const oldVerses = JSON.parse(localStorage.getItem("verses"));

  // main vars
  const [title, setTitle] = useState(oldTitle ? oldTitle : '');
  const [season, setSeason] = useState(oldSeason ? oldSeason : '');
  const [number, setNumber] = useState(oldNumber ? oldNumber : null);
  const [verses, setVerses] = useState(['']);

  // helper vars
  const [loading, setLoading] = useState(false);
  const hymnsRef = doc(db, 'index/hymns');

  const seasons = [
    { name: 'Advent', value: 'Advent' },
    { name: 'Vianoce', value: 'Vianoce' },
    { name: 'Pôst', value: 'Pôst' },
    { name: 'Veľká noc', value: 'Veľká noc' },
    { name: 'Vstúpenie', value: 'Vstúpenie' },
    { name: 'Zoslanie', value: 'Zoslanie' },
    { name: 'Trojjediný', value: 'Trojjediný' },
    { name: 'Cirkev', value: 'Cirkev' },
  ];

  // handle input change on verses
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const list = [...verses];
    list[index] = value;
    setVerses(list);
    localStorage.setItem('verses', JSON.stringify(list));
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...verses];
    list.splice(index, 1);
    setVerses(list);
    localStorage.setItem('verses', JSON.stringify(list));
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setVerses([...verses, ['']]);
    localStorage.setItem('verses', JSON.stringify(verses));
  };

  const createHymn = async () => {
    setLoading(true);
    await updateDoc(hymnsRef, {
      all: arrayUnion({
        title: title,
        number: number,
        season: season,
        verses: verses,
      }),
    });
    await updateDoc(hymnsRef, {
      lastChange: serverTimestamp(),
    });
    resetLocalStorage();
    resetState();
    setLoading(false);
  };

  const updateHymn = async () => {
    setLoading(true);
    await updateDoc(hymnsRef, {
      all: arrayRemove({
        title: hymn.title,
        number: hymn.number,
        season: hymn.season,
        verses: hymn.verses,
      }),
    });
    createHymn();
    setLoading(false);
  };

  const handleSubmit = () => {
    hymn ? updateHymn() : createHymn();
  };

  const submitText = () => {
    let text;
    if (hymn) {
      text = 'upraviť';
    } else {
      text = 'vytvoriť';
    }
    return text;
  };

  const resetState = () => {
    if (oldTitle === null) setTitle('');
    if (oldNumber === null) setNumber();
    if (oldSeason === null) setSeason('');
    setVerses(['']);
  };

  useEffect(() => {
    if (hymn) {
      setTitle(hymn.title);
      setSeason(hymn.season);
      setNumber(hymn.number);
      hymn.verses ? setVerses(hymn.verses) : setVerses(['']);
    } else {
      resetState();
    }
    // eslint-disable-next-line
  }, [hymn]);

  return (
    <div>
      <div className="p-card new-song-container">
        <div className="new-song-line">
          <h2>{hymn ? 'Upraviť pieseň' : 'Nová pieseň'}</h2>
        </div>
        <div className="new-song-line">
          <span className="p-float-label">
            <InputText
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                localStorage.setItem('title', e.target.value);
              }}
            />
            <label htmlFor="title">Názov piesne</label>
          </span>
          <span className="p-float-label">
            <InputNumber
              inputId="integeronly"
              value={number}
              id="number"
              onChange={(e) => {
                setNumber(e.value);
                localStorage.setItem('number', e.value);
              }}
            />
            <label htmlFor="number">Číslo piesne</label>
          </span>
          <Dropdown
            value={season ? season : null}
            options={seasons}
            onChange={(e) => {
              setSeason(e.value);
              localStorage.setItem('season', e.value);
            }}
            optionLabel="name"
            placeholder="Vyber obdobie"
          />
        </div>
        <div className="new-song-line">
          <h2>Text piesne</h2>
        </div>
        {verses?.map((item, i) => (
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
          style={{ minWidth: '120px' }}
          className="p-button-success"
          onClick={handleSubmit}
        >
          {loading ? (
            <ProgressSpinner
              style={{ width: '30px', height: '30px' }}
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

export default HymnForm;
