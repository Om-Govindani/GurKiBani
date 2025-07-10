import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import SGGSContext from "./contexts/SGGSContext.js"
import BookmarkContext from "./contexts/BookmarkContext.js";
import SGGS from "../public/SGGS.json";
import ShabadView from "./views/ShabadView.jsx";
import SearchView from "./views/SearchView.jsx";
import { useState , useEffect} from "react";
import BookmarkView from "./views/BookmarkView.jsx";
import NitnemView from "./views/NitnemView.jsx";
import BaniView from "./views/BaniView.jsx";


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
            <Route path="/bookmarks" element={<BookmarkView />} />
            <Route path="/nitnem" element={<NitnemView />} />
            <Route path="/bani" element={<Navigate to="/nitnem" replace />} />
            <Route path="/bani/:name" element={<BaniView />} />
          </Routes>
        </Router>
      </BookmarkContext.Provider>
    </SGGSContext.Provider>
  )
}

export default App
