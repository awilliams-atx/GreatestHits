import React, { Component } from 'react';
import UrlForm from '../containers/UrlForm';
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
      </section>
    );
  }

  onDraft () {
    this.props.passModal(function () {
      return <UrlForm passModal={this.props.passModal} />;
    }.bind(this));
  }

}

export default Desktop;
