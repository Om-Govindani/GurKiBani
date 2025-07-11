import { BrowserRouter as Router, Routes, Route ,Navigate ,useNavigate, useLocation} from "react-router-dom";
import SGGSContext from "./contexts/SGGSContext.js"
import BookmarkContext from "./contexts/BookmarkContext.js";
import LanguageContext from "./contexts/LanguageContext.js";
import SGGS from "../public/SGGS.json";
import ShabadView from "./views/ShabadView.jsx";
import SearchView from "./views/SearchView.jsx";
import { useState , useEffect} from "react";
import BookmarkView from "./views/BookmarkView.jsx";
import NitnemView from "./views/NitnemView.jsx";
import BaniView from "./views/BaniView.jsx";
import HistoryContext from "./contexts/HistoryContext.js";
import HistoryView from "./views/HistoryView.jsx";
function App() {
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "both";
  });

  const [history , setHistory] = useState(()=>{
    const stored = localStorage.getItem("history");
    return stored ? JSON.parse(stored) : []
  })

  const [bookmarks, setBookmarks] = useState(() => {
    const stored = localStorage.getItem("bookmarks");
    return stored ? JSON.parse(stored) : [];
  });

  
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(()=>{
    localStorage.setItem("history" , JSON.stringify(history));
  })

  return (
    <SGGSContext.Provider value = {SGGS}>
      <LanguageContext.Provider value={[language , setLanguage]} >
        <HistoryContext.Provider value={[history , setHistory]}>
          <BookmarkContext.Provider value={[bookmarks , setBookmarks]}>
            <Router>
              <Routes>
                <Route path="/" element={ <SearchView />} />
                <Route path="/reset" element={<Navigate to="/" replace />} />
                <Route path="/shabad/:startId" element={<ShabadView />} />
                <Route path="/bookmarks" element={<BookmarkView />} />
                <Route path="/nitnem" element={<NitnemView />} />
                <Route path="/bani" element={<Navigate to="/nitnem" replace />} />
                <Route path="/bani/:name" element={<BaniView />} />
                <Route path="/history" element={<HistoryView />} />
              </Routes>
            </Router>
          </BookmarkContext.Provider>
        </HistoryContext.Provider>
      </LanguageContext.Provider>
    </SGGSContext.Provider>
  )
}

export default App
