import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUrls } from '../actions';

class UrlIndex extends Component {
  constructor (props) {
    super(props);
    this.props.fetchUrls();
  }

  renderUrls () {
    this.props.urls.forEach(url => {
      return (
        <li key={url.id}>heresaurl</li>
      );
    });
  }

  render () {
    return (
      <section>
        <h1>GreatestHits</h1>
        {this.renderUrls()}
      </section>
    );
  }
}

function mapStateToProps (state) {
  return { urls: state.urls };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ fetchUrls }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlIndex);
