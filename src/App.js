import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connection to the server
const socket = io.connect('https://69025619-c21c-43b6-aa81-bc384bceb85a-00-2f9o3zboiiazp.worf.replit.dev/');

const App = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState({});
  const [messageHistory, setMessageHistory] = useState([]);

  const [room, setRoom] = useState('');

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room)
    }
  }

  const sendMessage = () => {
    socket.emit('send_message', { username: name, message, room });
  }

  useEffect(() => {
    // Listen the events -- Ascolta l'evento per ricevere i messaggi solo una volta
    const handleMessage = (e_data) => {
      setMessageReceived({ from: e_data.username, message: e_data.message });
      // Add new message to history
      setMessageHistory(prevMessages => [...prevMessages, e_data.message]);
    };

    socket.on('receive_message', handleMessage);

    // Clean up 
    return () => {
      socket.off('receive_message', handleMessage);
    };
  }, [socket]);

  return (
    <div id='app'>
      <input placeholder='Nome' onChange={ (event) => { setName(event.target.value) } } />
      <br />
      <input placeholder='Stanza' onChange={ (event) => { setRoom(event.target.value) } } />
      <button onClick={ joinRoom }> Unisciti </button>
      <br />
      <input placeholder='Messaggio' onChange={ (event) => { setMessage(event.target.value) } } />
      <button onClick={ sendMessage }> Invia Messaggio </button>
      <h3>Ultimo messaggio da
        { messageReceived.from && ` ${messageReceived.from}: ${messageReceived.message}` }
      </h3>

      <ul>
        {messageHistory.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
