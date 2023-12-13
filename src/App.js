import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Login from './Components/Login';
import Signup from './Components/Signup';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/dashboard/*" element={<Dashboard />} />

    </Routes>

  );
}

export default App;
