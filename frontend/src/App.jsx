import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SGGSContext from "./contexts/SGGSContext.js"
import BookmarkContext from "./contexts/BookmarkContext.js";
import SGGS from "../public/SGGS_final.json";
import ShabadView from "./views/ShabadView.jsx";
import SearchView from "./views/SearchView.jsx";
import { useState , useEffect} from "react";


function App() {
  const [bookmarks, setBookmarks] = useState(() => {
    const stored = localStorage.getItem("bookmarks");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);
  return (
    <SGGSContext.Provider value = {SGGS}>
      <BookmarkContext.Provider value={[bookmarks , setBookmarks]}>
        <Router>
          <Routes>
            <Route path="/" element={ <SearchView />} />
            <Route path="/shabad/:startId" element={<ShabadView />} />
          </Routes>
        </Router>
      </BookmarkContext.Provider>
    </SGGSContext.Provider>
  )
}

export default App
