import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserContext from "./contexts/UserContext.js"
import SGGS from "../public/SGGS_final.json";
import ShabadView from "./views/ShabadView.jsx";
import SearchView from "./views/SearchView.jsx";


function App() {
  return (
    <UserContext.Provider value = {SGGS}>
      <Router>
        <Routes>
          <Route path="/" element={ <SearchView />} />
          <Route path="/shabad/:startId" element={<ShabadView />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  )
}

export default App
