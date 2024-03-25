// App.js
import React from 'react';

import './App.css';
import Login from './Login';
import Signup from './Signup';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/login" component={Login} /> 
        <Signup /> 
      </div>
    </Router>
  );
}

export default App;
