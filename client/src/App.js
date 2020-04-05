import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import {Router} from '@reach/router'

function App() {
  return (
    <div className="App">
      <Router>
      <GameBoard path="/"/>
      </Router>
    </div>
  );
}

export default App;
