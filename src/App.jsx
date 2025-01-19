import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import MazdoorMitra from './components/MazdoorMitra';
import Login from "./components/Login";
import Profile from './components/Profile';
import Wallet from './components/Wallet';
import Home from './components/Home';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route path="/" element={<MazdoorMitra />}>
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/wallet" element={<Wallet />} />
                <Route exact path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
