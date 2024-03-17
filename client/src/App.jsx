import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Favourite from './pages/Favourite'
import Search from './pages/Search'
import Sidebar from './components/Sidebar'

function App() {

  return (
    <>
      <BrowserRouter>
        <Sidebar />
        <div className="flex-1 flex flex-col bg-[#15171E]" >
          <div className="px-6 h-[100vh] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
            <div className="flex-1 h-fit pb-40">
              <Routes>
                <Route path='/' exact element={<Dashboard />} />
                <Route path='/favourites' exact element={<Favourite />} />
                <Route path='/search' exact element={<Search />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
