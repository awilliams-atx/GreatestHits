import React, { Component } from 'react';

class UrlForm extends Component {
  constructor () {
    super();
    this.state = {
      desktop: '',
      mobile: '',
      tablet: ''
    };
  }

  render () {
    return (
      <div id='modal-background'>
        <aside id='modal' className='group' >
          <form>
            <label>Desktop
              <input value={this.state.desktop}
                onChange={this.onDesktopChange}/>
            </label>
            <label>Mobile
              <input value={this.state.mobile}
                onChange={this.onMobileChange}/>
            </label>
            <label>Tablet
              <input value={this.state.tablet}
                onChange={this.onTabletChange}/>
            </label>
            <div id='modal-buttons' className='group'>
              <button>Cancel</button>
              <button>Submit</button>
            </div>
          </form>
        </aside>
      </div>
    );
  }

  onDesktopChange () {
    this.setState({ desktop: e.target.value });
  }

  onMobileChange () {
    this.setState({ mobile: e.target.value });
  }

  onTabletChange () {
    this.setState({ tablet: e.target.value });
  }
}

export default UrlForm;
