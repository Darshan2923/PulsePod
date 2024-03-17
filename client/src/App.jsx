import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Favourite from './pages/Favourite'
import Search from './pages/Search'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<Dashboard />} />
          <Route path='/favourites' exact element={<Favourite />} />
          <Route path='/search' exact element={<Search />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
