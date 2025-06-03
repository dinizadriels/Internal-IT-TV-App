import React from 'react';

export default function Sidebar({ tasks }) {
  return (
    <aside className="sidebar">
      <ul>
        <img src="/images/bitrix.png" alt="Bitrix" /><br />
        <hr />
        <h3>SATS Abertas</h3><hr />
      </ul>
      <div className="module-mini-card">
        {tasks.map((task) => {
          const createdDate = new Date(task.CREATED_DATE);
          const formattedDate = `${createdDate.getDate().toString().padStart(2, '0')}/${(createdDate.getMonth() + 1).toString().padStart(2, '0')}/${createdDate.getFullYear()}`;
          
          return (
            <div key={task.ID} className="card1 bg-success" style={{ width: '12rem' }}>
              <div className="card-bitrix">
                <h4 className="card-title"><font color="#000000">{task.TITLE}</font></h4>
                <p className="card-text">Solicitante: {task.CREATED_BY_NAME}</p>
                <p className="card-text">Criado em:</p>
                <a href="#" className="btn btn-primary">{formattedDate}</a>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
