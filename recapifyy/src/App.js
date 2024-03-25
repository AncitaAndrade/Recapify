// App.js
import React from 'react';
import './App.css';
import Login from './Login';
import Signup from './Signup.jsx';
import Home from './Home.jsx';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={ <Signup/>}/>  
          <Route path="/" element = {<Home/>} />
          <Route path="/login" element={<Login/>} /> 
        </Routes>
      
    </BrowserRouter>
    </div>
  );
}

export default App;
