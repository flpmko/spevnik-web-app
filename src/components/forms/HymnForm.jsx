import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import {
  doc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import { db } from '../../firebase-config';

import '../../style/newSong.css';

const HymnForm = ({ hymn, resetLocalStorage, reload }) => {
  // data from local storage
  const oldTitle = localStorage.getItem('title');
  const oldNumber = localStorage.getItem('number');
  const oldSeason = localStorage.getItem('season');

  // main vars
  const [title, setTitle] = useState(oldTitle ? oldTitle : '');
  const [season, setSeason] = useState(oldSeason ? oldSeason : '');
  const [number, setNumber] = useState(oldNumber ? oldNumber : null);
  const [verses, setVerses] = useState(['']);

  // helper vars
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
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
    }).then(reload());
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

  const renderErrorMessage = (message) => {
    return (
      <Message severity="error" text={message} style={{ marginLeft: '20px' }} />
    );
  };

  const validate = () => {
    if (
      title === '' ||
      title === null ||
      number === undefined ||
      number === null
    ) {
      setShowMsg(true);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      hymn ? updateHymn() : createHymn();
    }
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
    setTitle('');
    setNumber();
    setSeason('');
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
          {showMsg && renderErrorMessage('Názov a číslo piesne sú povinné!')}
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
