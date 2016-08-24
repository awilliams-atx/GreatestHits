import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUrls } from '../actions';
import UrlRow from '../components/UrlRow';

class UrlIndex extends Component {
  constructor (props) {
    super(props);
    this.props.fetchUrls();

    this.renderUrls = this.renderUrls.bind(this);
  }

  render () {
    return (
      <article id='url-index'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Desktop</th>
              <th>Mobile</th>
              <th>Tablet</th>
            </tr>
          </thead>
          <tbody>
            {this.renderUrls()}
          </tbody>
        </table>
      </article>
    );
  }

  renderUrls () {
    return this.props.urls.map(url => {
      return UrlRow(url.attributes);
    });
  }
}

function mapStateToProps (state) {
  return { urls: state.urls };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ fetchUrls }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlIndex);
