import React, { Component } from 'react';
import Desktop from './Desktop.js';

class App extends Component {
  // uh
  render () {
    return (
      <div id='wrap'>
        <h1 id='title'>GreatestHits</h1>
        <Desktop />
      </div>
    );
  }
}

export default App;
