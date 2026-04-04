import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Router>  
        <Routes path="/" element={  <Home/> } />
      </Router>
    </Router>
    
    </>
  );
}

export default App;