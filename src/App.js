import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import droneService from './services/drones';

function App() {
  const [drones, setDrones] = useState([]);

  useEffect(() => {
    const fetchDrones = async () => {
      const resp = await droneService.getAllDrones();
      setDrones(resp);
    };
    fetchDrones();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(drones,"text/xml");

    console.log(typeof(xmlDoc));
    console.log(xmlDoc);
    const drones_xml = xmlDoc.getElementsByTagName("drone");
    console.log(drones_xml);

  }, [drones]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
