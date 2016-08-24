import React, { Component } from 'react';
import UrlForm from './UrlForm';
import UrlIndex from '../containers/UrlIndex';

class Desktop extends Component {
  constructor () {
    super();
    this.state = { drafting: false };
    this.onDraft = this.onDraft.bind(this);
  }

  render () {
    return (
      <section id='desktop'>
        <UrlIndex />
        <div id='toolbelt'>
          <i className="fa fa-file tool"
            aria-hidden="true"
            onClick={this.onDraft}></i>
        </div>
        {this.renderForm()}
      </section>
    );
  }

  renderForm () {
    if (this.state.drafting) {
      return <UrlForm />;
    }
  }

  onDraft () {
    this.setState({ drafting: !this.state.drafting });
  }
}

export default Desktop;
