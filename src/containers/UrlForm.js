import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { submitUrl } from '../actions';

class UrlForm extends Component {
  constructor () {
    super();
    this.state = {
      desktop: '',
      mobile: '',
      tablet: ''
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.listener = this.listener.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDesktopChange = this.onDesktopChange.bind(this);
    this.onMobileChange = this.onMobileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onTabletChange = this.onTabletChange.bind(this);
    this.removeListener = this.removeListener.bind(this);
  }

  render () {
    return (
      <div id='modal-background'>
        <aside id='modal' className='group' >
          <form>
            <label>Desktop
              <input value={this.state.desktop}
                onChange={this.onDesktopChange}
                ref='autoFocus' />
            </label>
            <label>Mobile
              <input value={this.state.mobile}
                onChange={this.onMobileChange} />
            </label>
            <label>Tablet
              <input value={this.state.tablet}
                onChange={this.onTabletChange} />
            </label>
            <div id='modal-buttons' className='group'>
              <button onClick={this.onCancel}>Cancel</button>
              <button onClick={this.onSubmit}>Submit</button>
            </div>
          </form>
        </aside>
      </div>
    );
  }

  componentDidMount () {
    this.refs.autoFocus.focus();
    document.getElementsByTagName('body')[0]
      .addEventListener('click', this.listener);
  }

  listener (e) {
    let body = document.getElementsByTagName('body')[0];
    let modal = document.getElementById('modal');
    if (!modal.contains(e.target)) {
      this.removeListener();
      this.props.passModal('');
    }
  }

  onCancel (e) {
    e.preventDefault();
    this.removeListener();
    this.props.passModal('');
  }

  onDesktopChange (e) {
    this.setState({ desktop: e.target.value });
  }

  onMobileChange (e) {
    this.setState({ mobile: e.target.value });
  }

  onSubmit (e) {
    e.preventDefault();
    this.removeListener();
    this.props.passModal('');
    this.props.submitUrl(this.state);
  }

  onTabletChange (e) {
    this.setState({ tablet: e.target.value });
  }

  removeListener () {
    document.getElementsByTagName('body')[0]
      .removeEventListener('click', this.listener);
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ submitUrl }, dispatch);
}

export default connect(null, mapDispatchToProps)(UrlForm);
