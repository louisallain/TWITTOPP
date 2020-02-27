import React from 'react';
import './Logo.css';

class Logo extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      logo_src: null,
    };
  }

  render() {
    return (
      <button className="logo-button" onClick={() => alert('clic')}>
        <img src={this.props.logo_src} onClick={() => alert('clic')} className="logo-img" alt="logo" />
      </button>
    );
  }
}

export default Logo;