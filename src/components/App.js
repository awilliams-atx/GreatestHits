import React, { Component } from 'react';
import Desktop from './Desktop.js';

class App extends Component {
  constructor () {
    super();
    this.state = { modal: undefined };
    this.passModal = this.passModal.bind(this);
  }
  render () {
    console.log(this.state);
    return (
      <div id='wrap'>
        <h1 id='title'>GreatestHits</h1>
        <Desktop passModal={this.passModal} />
        {this.renderModal()}
      </div>
    );
  }

  renderModal () {
    if (this.state.modal) {
      return this.state.modal();
    }
  }

  passModal (modal) {
    this.setState({ modal: modal })
  }
}

export default App;
