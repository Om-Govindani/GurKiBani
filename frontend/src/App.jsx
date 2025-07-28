import { BrowserRouter as Router, Routes, Route ,Navigate ,useNavigate, useLocation} from "react-router-dom";
import mixpanel from 'mixpanel-browser';
import { v4 as uuidv4 } from 'uuid';
import SGGSContext from "./contexts/SGGSContext.js"
import BookmarkContext from "./contexts/BookmarkContext.js";
import LanguageContext from "./contexts/LanguageContext.js";
import SGGS from "../public/SGGS.json";
import ShabadView from "./views/ShabadView.jsx";
import SearchView from "./views/SearchView.jsx";
import { useState , useEffect , useRef} from "react";
import BookmarkView from "./views/BookmarkView.jsx";
import NitnemView from "./views/NitnemView.jsx";
import BaniView from "./views/BaniView.jsx";
import HistoryContext from "./contexts/HistoryContext.js";
import HistoryView from "./views/HistoryView.jsx";
import AboutUs from "./views/AboutUs.jsx";
import SilentAudio from "./components/SilentAudio.jsx";
import SahajPaathView from "./views/SahajPaathView.jsx";
import AngContext from "./contexts/AngContext.js";



function App() {

  const [ang , setAng] = useState(() =>{
    return localStorage.getItem("ang") || "1";
  })
  
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

  useEffect(()=>{
    localStorage.setItem("ang" ,ang);
  },[ang]);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(()=>{
      localStorage.setItem("history" , JSON.stringify(history));
    })

  useEffect(() => {
    mixpanel.init("5288e40acba2f12eb049438934b2af9c", {
      debug: true,
      ignore_dnt: true,
    });
    
    let distinctId = localStorage.getItem("mixpanel_distinct_id");
    if (!distinctId) {
      distinctId = uuidv4(); // or use uuid
      localStorage.setItem("mixpanel_distinct_id", distinctId);
    }
    mixpanel.identify(distinctId);

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    mixpanel.register({
      deviceType: isMobile ? "Mobile" : "Desktop",
    });

    mixpanel.track("App Opened", {
      deviceType: isMobile ? "Mobile" : "Desktop",
      platform: navigator.platform,
      userAgent: navigator.userAgent,
    });
    window.addEventListener("appinstalled", () => {
      mixpanel.track("PWA Installed");
    });
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault(); // Prevent browser default
      deferredPrompt = e;

      // Track event
      mixpanel.track("Install Prompt Shown");

      // You can store `deferredPrompt` to trigger manually later
      // setDeferredPrompt(e);
    });
  }, []);

  useEffect(() => {
  function disableZoom(e) {
    if (e.touches.length > 1) {
      e.preventDefault(); // stops pinch zoom
    }
  }

  document.addEventListener('touchmove', disableZoom, { passive: false });

  return () => {
    document.removeEventListener('touchmove', disableZoom);
  };
}, []);



  return (
    <SGGSContext.Provider value = {SGGS}>
      <AngContext.Provider value={[ang , setAng]}>
        <LanguageContext.Provider value={[language , setLanguage]} >
          <HistoryContext.Provider value={[history , setHistory]}>
            <BookmarkContext.Provider value={[bookmarks , setBookmarks]}>
              <SilentAudio />
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
                  <Route path="*" element={<Navigate to="/" replace />} />
                  <Route path="/SahajPaath" element={<SahajPaathView />} />
                </Routes>
              </Router>
            </BookmarkContext.Provider>
          </HistoryContext.Provider>
        </LanguageContext.Provider>
      </AngContext.Provider>
    </SGGSContext.Provider>
  )
}

export default App
