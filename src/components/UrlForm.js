import React, { Component } from 'react';

class UrlForm extends Component {
  getInitialState () {
    return {
      desktop: '',
      mobile: '',
      tablet: ''
    }
  }
  render () {
    return (
      <form>
        <input value={this.state.desktop} />
      </form>
    );
  }
}

export default UrlForm;
