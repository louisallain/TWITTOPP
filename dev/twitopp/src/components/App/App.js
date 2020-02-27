import React from 'react';
import logo from '../../images/logo.svg';
import './App.css';

import Logo from '../Logo/Logo'

function App() {

  return (

    <div className="App">
      <div className="Left-menu">
        <Logo logo_src={logo} />
      </div>
    </div>
  );
}

export default App;
