import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import UserWrapper from './wrapper/UserWrapper';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Signup />} />
        <Route path='/user/home' element={<UserWrapper><Home /></UserWrapper>} />
      </Routes>
    </>
  )
}

export default App
