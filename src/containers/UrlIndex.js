import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUrls, sortUrls } from '../actions';
import UrlRow from '../components/UrlRow';

class UrlIndex extends Component {
  constructor (props) {
    super(props);
    this.props.fetchUrls();
    this.state = {
      desktopHits: false,
      mobileHits: false,
      tabletHits: false,
      desktopRedirects: false,
      mobileRedirects: false,
      tabletRedirects: false
    };

    this.renderUrls = this.renderUrls.bind(this);
    this.sort = this.sort.bind(this);
  }

  render () {
    console.log('rendering');
    return (
      <article id='url-index'>
        <table>
          <thead>
            <tr>
              <th><i className="fa fa-hashtag" aria-hidden="true"></i></th>
              <th>
                <span className='table-icon' data-metric='desktopHits' onClick={this.sort}>
                  <i className="fa fa-long-arrow-down"
                    aria-hidden="true"></i>
                  <i className="fa fa-desktop"
                    aria-hidden="true"></i>
                </span>
                &nbsp;/&nbsp;
                <span className='table-icon' data-metric='desktopRedirects' onClick={this.sort}>
                  <i className="fa fa-desktop"
                    aria-hidden="true"></i>
                  <i className="fa fa-arrow-right" aria-hidden="true"></i>
                </span>
              </th>
              <th>
                <span className='table-icon' data-metric='mobileHits' onClick={this.sort}>
                  <i className="fa fa-long-arrow-down"
                    aria-hidden="true"></i>
                  <i className="fa fa-mobile"
                    aria-hidden="true"></i>
                </span>
                &nbsp;/&nbsp;
                <span className='table-icon' data-metric='mobileRedirects' onClick={this.sort}>
                  <i className="fa fa-mobile"
                    aria-hidden="true"></i>
                  <i className="fa fa-arrow-right" aria-hidden="true"></i>
                </span>
              </th>
              <th>
                <span className='table-icon' data-metric='tabletHits' onClick={this.sort}>
                  <i className="fa fa-long-arrow-down"
                    aria-hidden="true"></i>
                  <i className="fa fa-tablet"
                    aria-hidden="true"></i>
                </span>
                &nbsp;/&nbsp;
                <span className='table-icon' data-metric='tabletRedirects' onClick={this.sort}>
                  <i className="fa fa-tablet"
                    aria-hidden="true"></i>
                  <i className="fa fa-arrow-right" aria-hidden="true"></i>
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

  sort (e) {
    let metric = e.currentTarget.dataset.metric;
    this.props.sortUrls(this.props.urls, metric, this.state[metric]);
    let newState = {};
    newState[metric] = !this.state[metric];
    this.setState(newState);
  }
}

function mapStateToProps (state) {
  return { urls: state.urls };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ fetchUrls, sortUrls }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlIndex);
