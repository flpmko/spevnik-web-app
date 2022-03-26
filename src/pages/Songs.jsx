import { useState, useEffect } from 'react';
import { getDoc, doc, arrayRemove, updateDoc } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';

import { db } from '../firebase-config';
import HymnForm from '../components/forms/HymnForm';
import SongForm from '../components/forms/SongForm';
import SongItem from '../components/items/SongItem';

import '../style/songs.css';

const Songs = () => {
  //main vars
  const [hymns, setHymns] = useState([]);
  const [hymn, setHymn] = useState(null);
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);

  // db refs
  const hymnsDocRef = doc(db, 'index/hymns');
  const songsDocRef = doc(db, 'index/songs');

  // pagination
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [first, setFirst] = useState(0);
  const currentHymns = hymns.slice(first, first + itemsPerPage);
  const currentSongs = songs.slice(first, first + itemsPerPage);

  // helpers
  const [loading, setLoading] = useState(false);
  const [isHymn, setIsHymn] = useState();
  const [query, setQuery] = useState();
  const [orderAscHymns, setOrderAscHymns] = useState(false);
  const [orderAscSongs, setOrderAscSongs] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Spevníkové');
  const categories = [
    { name: 'Spevníkové', value: 'Spevníkové' },
    { name: 'Mládežnícke', value: 'Mládežnícke' },
    // { name: 'Antifóny', value: 'Antifóny' },
    // { name: 'Predspevy', value: 'Predspevy' },
  ];

  const confirm = (songItem) => {
    confirmDialog({
      message: 'Naoazaj chceš vymazať pieseň ' + songItem.title + '?',
      header: 'Potvrdenie',
      acceptLabel: 'Áno',
      rejectLabel: 'Nie',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      rejectClassName: 'p-button-secondary',
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
      setLoading(false);
      getSongsData();
    }
  };

  const resetLocalStorage = () => {
    localStorage.removeItem('title');
    localStorage.removeItem('chords');
    localStorage.removeItem('number');
    localStorage.removeItem('season');
    localStorage.removeItem('verses');
  };

  const newSongForm = () => {
    resetLocalStorage();
    setHymn(null);
    setSong(null);
  };

  const changeCategory = (e) => {
    setActiveCategory(e.value);
    if (e.value === 'Spevníkové') {
      setQuery(undefined);
    } else {
      setQuery('');
    }
    localStorage.setItem('category', e.value);
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
    const hymnsData = await getDoc(hymnsDocRef);
    setHymns(hymnsData.get('all'));
  };

  const getSongsData = async () => {
    const songsData = await getDoc(songsDocRef);
    setSongs(songsData.get('all'));
  };

  useEffect(() => {
    setLoading(true);
    const category = localStorage.getItem('category');
    if (category) setActiveCategory(category);
    if (activeCategory === 'Spevníkové') {
      setIsHymn(true);
      setQuery(undefined);
    } else {
      setIsHymn(false);
      setQuery('');
    }
    getHymnsData();
    getSongsData();
    orderHymns();
    orderSongs();
    setLoading(false);
    // eslint-disable-next-line
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
            display: 'flex',
            alignItems: 'center',
            paddingBottom: '20px',
            justifyContent: 'space-between',
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
        <div style={{ display: 'flex', gap: '20px' }}>
          {activeCategory === categories.at(0).name ? (
            <HymnForm hymn={hymn} resetLocalStorage={resetLocalStorage} />
          ) : (
            <SongForm song={song} resetLocalStorage={resetLocalStorage} />
          )}
          <div
            className="songs-list p-card"
            style={{ backgroundColor: 'GrayText', minWidth: '450px' }}
          >
            {isHymn && (
              <div className="p-inputgroup" style={{ paddingBottom: '20px' }}>
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
                      ? 'pi pi-sort-numeric-up'
                      : 'pi pi-sort-numeric-down'
                  }
                  className="p-button-primary"
                  onClick={orderHymns}
                />
              </div>
            )}
            {!isHymn && (
              <div className="p-inputgroup" style={{ paddingBottom: '20px' }}>
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
                      ? 'pi pi-sort-alpha-up'
                      : 'pi pi-sort-alpha-down'
                  }
                  className="p-button-primary"
                  onClick={orderSongs}
                />
              </div>
            )}
            {loading && (
              <ProgressSpinner
                style={{ width: '30px', height: '30px' }}
                strokeWidth="5"
              />
            )}
            {isHymn &&
              currentHymns
                .filter((searchHymn) =>
                  searchHymn.number.toString().match(query)
                )
                .map((hymnItem) => {
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
              currentSongs
                .filter((searchSong) =>
                  searchSong.title.toLowerCase().includes(query)
                )
                .map((songItem) => {
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
            <Paginator
              first={first}
              rows={itemsPerPage}
              totalRecords={hymns.length}
              onPageChange={onPageChange}
              rowsPerPageOptions={[5, 10, 20, 30]}
            ></Paginator>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Songs;
