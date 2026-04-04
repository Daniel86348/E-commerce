import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

function App() {
  return (
    <>
    <Router>
      <Router>  
        <Routes path="/" element={   <Home/>  } />
      </Router>
    </Router>
    
    </>
  );
}

export default App;