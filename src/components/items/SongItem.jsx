import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';

const SongItem = ({
  hymn,
  setHymn,
  loading,
  isHymn,
  song,
  setSong,
  confirm,
}) => {
  return (
    <div
      key={isHymn ? hymn.number : song.title}
      className="songs-list-item p-card"
    >
      <div className="songs-title-container">
        <h2
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {isHymn ? hymn.number + ' - ' : null}
          {isHymn ? hymn.title : song.title}
        </h2>
      </div>
      <div className="songs-button-container">
        <Button
          id="new-song"
          icon="pi pi-pencil"
          className="p-button-warning"
          onClick={() => {
            isHymn ? setHymn(hymn) : setSong(song);
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
          onClick={() => (isHymn ? confirm(hymn) : confirm(song))}
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
  );
};

export default SongItem;
