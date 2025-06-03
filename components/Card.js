import React from 'react';

export default function Card({ title, description, status, icon }) {
  return (
    <article className="card scale-in">
      <div className="card-header">
        <div>
          <span>
            <img src={icon} alt={title} />
          </span>
          <h3>{title}</h3>
        </div>
      </div>
      <div className="card-body">
        <p>{description}</p>
      </div>
      <div className={status === 'on' ? 'card-footer' : 'card-footer1'}>
        {status === 'off' && (
          <audio id="statusChangeAudio" autoPlay style={{ display: 'none' }}>
            <source src="/sounds/down.mp3" type="audio/mp3" />
          </audio>
        )}
        <p>{status === 'on' ? 'Online' : 'Offline'}</p>
      </div>
    </article>
  );
}
