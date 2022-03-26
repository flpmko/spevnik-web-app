import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';

function SongItem({ hymn, setHymn, loading, isHymn, song, setSong, confirm }) {
  return (
    <div
      key={hymn ? hymn.number : song.title}
      className="songs-list-item p-card"
    >
      <h2>
        {isHymn === true ? hymn.number + ' - ' : null}
        {hymn ? hymn.title : song.title}
      </h2>
      <div className="songs-inforow">
        <div className="songs-button-container">
          <Button
            id="new-song"
            icon="pi pi-pencil"
            className="p-button-warning"
            onClick={() => {
              hymn ? setHymn(hymn) : setSong(song);
            }}
            style={{
              paddingLeft: '5px',
              paddingRight: '5px',
              height: '30px',
            }}
          ></Button>
          <Button
            id="new-song"
            icon={loading ? '' : 'pi pi-minus'}
            onClick={() => (hymn ? confirm(hymn) : confirm(song))}
            style={{
              paddingLeft: '5px',
              paddingRight: '5px',
              height: '30px',
            }}
            className="p-button-danger"
          >
            {loading ? (
              <ProgressSpinner
                style={{
                  width: '20px',
                  height: '20px',
                }}
                strokeWidth="2"
              />
            ) : null}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SongItem;
