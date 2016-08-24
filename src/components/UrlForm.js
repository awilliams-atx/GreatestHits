import React, { Component } from 'react';

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
    this.onSubmit = this.onSubmit.bind(this);
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

  onDesktopChange () {
    this.setState({ desktop: e.target.value });
  }

  onMobileChange () {
    this.setState({ mobile: e.target.value });
  }

  onSubmit (e) {
    e.preventDefault();
    this.removeListener();
    this.props.passModal('');
  }

  onTabletChange () {
    this.setState({ tablet: e.target.value });
  }

  removeListener () {
    document.getElementsByTagName('body')[0]
      .removeEventListener('click', this.listener);
  }
}

export default UrlForm;
