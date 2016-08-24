import React, { Component } from 'react';
import UrlForm from './Desktop';
import Toolbelt from './Toolbelt';
import UrlIndex from '../containers/UrlIndex';

class Desktop extends Component {
  constructor () {
    super();
    this.state = { drafting: false };
  }

  render () {
    return (
      <section id='desktop'>
        {this.renderForm()}
        <UrlIndex />
        <Toolbelt />
      </section>
    );
  }

  renderForm () {
    if (this.state.drafting) {
      return <UrlForm />;
    }
  }
}

export default Desktop;
