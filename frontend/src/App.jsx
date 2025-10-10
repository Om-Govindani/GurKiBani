import { BrowserRouter as Router, Routes, Route ,Navigate ,useNavigate, useLocation} from "react-router-dom";
import mixpanel from 'mixpanel-browser';
import { v4 as uuidv4 } from 'uuid';
import SGGSContext from "./contexts/SGGSContext.js"
import BookmarkContext from "./contexts/BookmarkContext.js";
import LanguageContext from "./contexts/LanguageContext.js";
// import SGGS from "../public/SGGS.json";
import ShabadView from "./views/ShabadView.jsx";
import SearchView from "./views/SearchView.jsx";
import { useState , useEffect , useRef} from "react";
import BookmarkView from "./views/BookmarkView.jsx";
import NitnemView from "./views/NitnemView.jsx";
import BaniView from "./views/BaniView.jsx";
import HistoryContext from "./contexts/HistoryContext.js";
import HistoryView from "./views/HistoryView.jsx";
import AboutUs from "./views/AboutUs.jsx";
import SahajPaathView from "./views/SahajPaathView.jsx";
import AngContext from "./contexts/AngContext.js";
import BackgroundMedia from "./components/BackgroundMedia.jsx";
import Instructions from "./views/Instructions.jsx"
import FontSizeContext from "./contexts/FontSizeContext.js";
import EngTranslitrationContext from "./contexts/EngTranslitrationContext.js";
import HindiTeekaBhavArthContext from "./contexts/HindiTeekaBhavArthContext.js";
import HindiTeekaShabadArthContext from "./contexts/HindiTeekaShabadArthContext.js";
import HindiTranslationContext from "./contexts/HindiTranslationContext.js";



function App() {

  const [sggsData, setSggsData] = useState(null);
  const [error, setError] = useState(null);
  const wakeLockRef = useRef(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/SGGS.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSggsData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch SGGS data:", err);
        setError("Failed to load Gurbani data. You may be offline or the data is not cached.");
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [ang , setAng] = useState(() =>{
    return localStorage.getItem("ang") || "1";
  })

  const [engTranslitration , setEngTranslitration] = useState(() =>{
    const stored = localStorage.getItem("engTranslitration");
    return stored ? JSON.parse(stored) : false;
  });

  const [hindiTeekaBhavArth , setHindiTeekaBhavArth] = useState(() =>{
    const stored = localStorage.getItem("hindiTeekaBhavArth");
    return stored ? JSON.parse(stored) : false;
  });

  const [hindiTeekaShabadArth , setHindiTeekaShabadArth] = useState(() =>{
    const stored = localStorage.getItem("hindiTeekaShabadArth");
    return stored ? JSON.parse(stored) : false;
  });

  const [hindiTranslation , setHindiTranslation] = useState(() =>{
    const stored = localStorage.getItem("hindiTranslation");
    return stored ? JSON.parse(stored) : false;
  });


  const [fontSize , setFontSize] = useState(() =>{
    const stored = localStorage.getItem("fontSize");
    return stored ? JSON.parse(stored) : 24;
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

  useEffect(()=>{
    localStorage.setItem("fontSize" ,JSON.stringify(fontSize));
  },[fontSize]);

  useEffect(()=>{
    localStorage.setItem("engTranslitration", JSON.stringify(engTranslitration));
  },[engTranslitration]);

  useEffect(()=>{
    localStorage.setItem("hindiTeekaBhavArth", JSON.stringify(hindiTeekaBhavArth));
  },[hindiTeekaBhavArth]);

  useEffect(()=>{
    localStorage.setItem("hindiTeekaShabadArth", JSON.stringify(hindiTeekaShabadArth));
  },[hindiTeekaShabadArth]);

  useEffect(()=>{
    localStorage.setItem("hindiTranslation", JSON.stringify(hindiTranslation));
  },[hindiTranslation]);



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
    if (!('wakeLock' in navigator)) return; // Agar feature supported nahi hai, toh stop ho jao

    const requestWakeLock = async () => {
      try {
        // Screen Wake Lock request
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        console.log('Wake Lock active!');

        wakeLockRef.current.addEventListener('release', () => {
          console.log('Wake Lock was released. Re-requesting...');
          // Agar lock release ho gaya, toh dobara request karo (e.g., jab screen unlock hoti hai)
          requestWakeLock();
        });

      } catch (err) {
        console.error(`Wake Lock failed: ${err.name}, ${err.message}`);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // App jab foreground mein aaye toh lock request karo
        requestWakeLock();
      } else if (wakeLockRef.current) {
        // App jab background mein jaaye toh lock release karo (battery save)
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };

    // Events add karo
    document.addEventListener('visibilitychange', handleVisibilityChange);
    requestWakeLock(); // Component mount hone par pehli baar request

    // Cleanup: Component unmount hone par lock release karo
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Wake Lock released on unmount.');
      }
    };
  }, []); // Run only once


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
    <SGGSContext.Provider value = {sggsData}>
      <AngContext.Provider value={[ang , setAng]}>
        <FontSizeContext.Provider value={[fontSize , setFontSize]}>
          <LanguageContext.Provider value={[language , setLanguage]} >
            <EngTranslitrationContext.Provider value={[engTranslitration , setEngTranslitration]} >
              <HindiTeekaBhavArthContext.Provider value={[hindiTeekaBhavArth , setHindiTeekaBhavArth]}>
                <HindiTeekaShabadArthContext.Provider value={[hindiTeekaShabadArth , setHindiTeekaShabadArth]}>
                  <HindiTranslationContext.Provider value={[hindiTranslation , setHindiTranslation]} >
                    <HistoryContext.Provider value={[history , setHistory]}>
                      <BookmarkContext.Provider value={[bookmarks , setBookmarks]}>
                        {/* <SilentAudio /> */}
                        {/* <BackgroundMedia /> */}
                          <Router>
                            <Routes>
                              <Route path="/" element={ <SearchView />} />
                              <Route path="/instructions" element={ <Instructions />} />
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
                  </HindiTranslationContext.Provider>
                </HindiTeekaShabadArthContext.Provider>
              </HindiTeekaBhavArthContext.Provider>
            </EngTranslitrationContext.Provider>
          </LanguageContext.Provider>
        </FontSizeContext.Provider>
      </AngContext.Provider>
    </SGGSContext.Provider>
  )
}

export default App
