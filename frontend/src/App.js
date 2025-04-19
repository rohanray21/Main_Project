import React from 'react'; import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; import Register from './pages/Register';

function App() { return ( <Router> <div className="App"> <Routes> <Route path="/register" element={<Register />} /> {/* You can add more routes here like login, home, etc. */} </Routes> </div> </Router> ); }

export default App;