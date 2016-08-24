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
    this.reorder = this.reorder.bind(this);
  }

  render () {
    return (
      <article id='url-index'>
        <table>
          <thead>
            <tr>
              <th><i className="fa fa-hashtag" aria-hidden="true"></i></th>
              <th>
                <span data-metric='dt-hit' onClick={this.reorder}>
                  <i className="fa fa-long-arrow-down" aria-hidden="true"></i>
                  <i className="fa fa-desktop" aria-hidden="true"></i>
                </span>
                /
                <span data-metric='dt-redirect' onClick={this.reorder}>
                  <i className="fa fa-desktop" aria-hidden="true"></i>
                  <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                </span>
              </th>
              <th>
                <span data-metric='moibile-hit' onClick={this.reorder}>
                  <i className="fa fa-long-arrow-down" aria-hidden="true"></i>
                  <i className="fa fa-mobile" aria-hidden="true"></i>
                </span>
                /
                <span data-metric='moibile-redirect' onClick={this.reorder}>
                  <i className="fa fa-mobile" aria-hidden="true"></i>
                  <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                </span>
              </th>
              <th>
                <span data-metric='tablet-hit' onClick={this.reorder}>
                  <i className="fa fa-long-arrow-down" aria-hidden="true"></i>
                  <i className="fa fa-tablet" aria-hidden="true"></i>
                </span>
                /
                <span data-metric='tablet-redirect' onClick={this.reorder}>
                  <i className="fa fa-tablet" aria-hidden="true"></i>
                  <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                </span>
              </th>
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

  reorder (e) {
    console.log(e.currentTarget.dataset.metric);
  }
}

function mapStateToProps (state) {
  return { urls: state.urls };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ fetchUrls }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlIndex);
