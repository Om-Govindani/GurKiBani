import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBar from "./components/SearchBar.jsx"
import SearchResults from "./components/SearchResults.jsx";
import {useState , useEffect} from "react"
import UserContext from "./contexts/UserContext.js"
import SGGS from "./assets/SGGS_final.json";
import ShabadView from "./views/ShabadView.jsx";


function App() {
  const [results , setResults] = useState([]) ;
  return (
    <UserContext.Provider value = {SGGS}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
                <div className="bg-neutral-900 h-screen w-full py-4 flex flex-col items-center justify-center px-4">
                  < SearchBar results = {results} setResults = {setResults} />
                  < SearchResults results = {results}/>
                </div>
              } 
          />
          <Route path="/shabad/:startId" element={<ShabadView />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  )
}

export default App
