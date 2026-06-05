import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home    from './pages/Home'
import Search  from './pages/Search'
import Saved   from './pages/Saved'
import Profile from './pages/Profile'
import ClubProfile from './pages/ClubProfile'
import EventDetail from './pages/EventDetail'
import Login   from './pages/Login'
import Register from './pages/Register'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/search"  element={<Search />} />
        <Route path="/saved"   element={<Saved />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/club/:id"  element={<ClubProfile />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}