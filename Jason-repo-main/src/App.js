import React from 'react';
import { Routes , Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';

function App() {
  return (
    <Routes>
      {/*Pages*/}
      <Route exact path="/" element={<Home />} />
      <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
