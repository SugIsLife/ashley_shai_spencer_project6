import React, { Component } from 'react';
import './App.css';

// COMPONENTS
import AutoSuggest from './components/AutoSuggest'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Sug Fun!</h1>
        <AutoSuggest />
      </div>
    );
  }
}

export default App;
