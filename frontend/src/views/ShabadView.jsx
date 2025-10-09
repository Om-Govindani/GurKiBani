import { useParams, useSearchParams } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../contexts/SGGSContext";
import SizeControlBtns from "../components/buttons/SizeControlBtns";
import AutoScroll from "../components/buttons/AutoScroll";
import TopBar from "../components/TopBar";
import EmptyPage from "../components/EmptyPage";
import LanguageContext from "../contexts/LanguageContext";
import FontSizeContext from "../contexts/FontSizeContext";
import HindiTranslationContext from "../contexts/HindiTranslationContext";
import HindiTeekaShabadArthContext from "../contexts/HindiTeekaShabadArthContext";
import HindiTeekaBhavArthContext from "../contexts/HindiTeekaBhavArthContext";
import EngTranslitrationContext from "../contexts/EngTranslitrationContext";

function ShabadView() {
  const { startId } = useParams();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const from = searchParams.get("from");
  const SGGS = useContext(UserContext);
  const [fontSize, setFontSize] = useContext(FontSizeContext);
  const [engTranslitration] = useContext(EngTranslitrationContext);
  const [hindiTeekaBhavArth] = useContext(HindiTeekaBhavArthContext);
  const [hindiTeekaShabadArth] = useContext(HindiTeekaShabadArthContext);
  const [hindiTranslation] = useContext(HindiTranslationContext);
  const [showControls, setShowControls] = useState(true);
  const verseRef = useRef({});
  const verseContainerRef = useRef(null);
  const [language] = useContext(LanguageContext);
  const [controlsVisible, setControlsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const RAAG_NAMES = [
    "ਰਾਗੁ","ਸ੍ਰੀ","ਮਾਝ","ਗਉੜੀ","ਆਸਾ","ਗੁਜਰੀ","ਦੇਵਗੰਧਾਰੀ","ਬਿਹਾਗੜਾ",
    "ਵਡਹੰਸ","ਸੋਰਠ","ਧਨਾਸਰੀ","ਜੈਜਾਵੰਤੀ","ਤਿਲੰਗ","ਸੁਹੀ","ਬਿਲਾਵਲ",
    "ਗੋਂਡ","ਰਾਮਕਲੀ","ਭੈਰਉ","ਬਸੰਤ","ਸਾਰੰਗ","ਬੈਰਾਰੀ","ਸੂਹੀ" , "ਗਉੜੀ ਦੀਪਕੀ",
    "ਗਉੜੀ ਪੂਰਬੀ" , "ਸਿਰੀ ਰਾਗੁ" , "ਸਿਰੀ" , "ਗਉੜੀ ਗੁਆਰੇਰੀ" , "ਗਉੜੀ ਦਖਣੀ",
    "ਗਉੜੀ ਚੇਤੀ" , "ਗਉੜੀ ਬੈਰਾਗਣਿ" , "ਗਉੜੀ ਪੂਰਬੀ ਦੀਪਕੀ" , "ਗਉੜੀ ਮਾਝ" , "ਗੌੜੀ ਮਾਲਵਾ",
    "ਗਉੜੀ ਮਾਲਾ" , "ਗਉੜੀ ਸੋਰਠਿ", "ਆਸਾ ਕਾਫੀ" , "ਆਸਾਵਰੀ" , "ਆਸਾ ਆਸਾਵਰੀ" ,
    "ਜੈਤਸਰੀ" , "ਟੋਡੀ" , "ਬੈਰਾੜੀ" , "ਤਿਲੰਗ" , "ਤਿਲੰਗ ਕਾਫੀ" , "ਗੋਂਡ",
    "ਨਟ" , "ਮਾਲੀ ਗਉੜਾ" , "ਮਾਰੂ" , "ਤੁਖਾਰੀ" , "ਕੇਦਾਰਾ" , "ਬਸੰਤੁ",
    "ਮਲਾਰ" , "ਕਾਨੜਾ" , "ਕਲਿਆਨ" , "ਪ੍ਰਭਾਤੀ" , 
]

  const SECTION_KW = ["ਸਲੋਕ", "ਅਸਟਪਦੀ", "ਚਉਪਈ", "ਚੰਤ", "ਥਿਤੀ", "ਵਾਰ", "ਮਃ", "ਮਹਲਾ"];

  // Handle pinch to zoom
  useEffect(() => {
    let initialDistance = null;

    function getDistance(touches) {
      const [a, b] = touches;
      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchMove(e) {
      if (e.touches.length === 2) {
        const distance = getDistance(e.touches);
        if (initialDistance === null) {
          initialDistance = distance;
        } else {
          const delta = distance - initialDistance;
          if (Math.abs(delta) > 10) {
            setFontSize((f) => {
              const newSize = delta > 0 ? Math.min(f + 1, 48) : Math.max(f - 1, 12);
              return newSize;
            });
            initialDistance = distance;
          }
        }
      }
    }

    function resetDistance() {
      initialDistance = null;
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", resetDistance);
    document.addEventListener("touchcancel", resetDistance);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", resetDistance);
      document.removeEventListener("touchcancel", resetDistance);
    };
  }, []);


  useEffect(() => {
    if (highlightId && verseRef.current[highlightId]) {
      verseRef.current[highlightId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightId]);

  const shabadVerses = SGGS
    ? Object.entries(SGGS).filter(
        ([id, verse]) => verse[5] === startId
      )
    : [];

  const shouldHighlightFirstVerse = (() => {
    const firstVerse = shabadVerses[0]?.[1]?.[0] || "";
    return [...RAAG_NAMES, ...SECTION_KW].some((kw) => firstVerse.includes(kw));
  })();

  const showControlsTemporarily = () => {
    setControlsVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setControlsVisible(false), 3000);
  };

  // Detect global interactions
  useEffect(() => {
    const handleInteraction = () => showControlsTemporarily();
    window.addEventListener("scroll", handleInteraction);
    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-neutral-900 px-2 py-5 relative flex flex-col">
      
        <TopBar highlightId={highlightId} from={from} containerRef={verseContainerRef}/>
      
      {/* <TopBar highlightId={highlightId} from={from} /> */}
      <div className="w-full flex-1 h-full mx-auto pt-[50px] relative overflow-y-scroll"
        ref={verseContainerRef}
        // style={{ height: `calc(100vh - 80px)` }}
      >
        {/* <div className="h-10"></div> */}
        {shabadVerses.length === 0 ? (
          <EmptyPage title={"Waheguru ❤️"} />
        ) : (
          shabadVerses.map(([id, verse], index) => {
            const isFirstVerse = index === 0;
            const applySpecialColor = isFirstVerse && shouldHighlightFirstVerse;

            return (
              <div
                key={id}
                ref={(el) => (verseRef.current[id] = el)}
                className={` max-w-3xl py-3 transition-all duration-200 text-center mx-auto`}
              >
                {language !== "hindi" && (
                  <div
                    className={`font-gurmukhi ${
                      id === highlightId ? "bg-white/15" : ""
                    } ${applySpecialColor ? "text-rose-300" : "text-violet-50"}`}
                    style={{ fontSize: `${fontSize}px`, lineHeight: "1.4" }}
                  >
                    {verse[0]}
                  </div>
                )}
                {language !== "gurmukhi" && (
                  <div
                    className={`font-hindi ${
                      id === highlightId ? "bg-white/15" : ""
                    } ${applySpecialColor ? "text-orange-400" : "text-orange-200"}`}
                    style={{ fontSize: `${fontSize - 2}px` }}
                  >
                    {verse[1]}
                  </div>
                )}
                {engTranslitration && <div
                  className={`font-hindi ${
                    id === highlightId ? "bg-white/15" : ""
                  } text-gray-300 italic`}
                  style={{ fontSize: `${fontSize - 2}px` }}
                >
                  {verse[7]}
                </div>}
                {hindiTranslation && <div
                  className={`font-hindi ${
                    id === highlightId ? "bg-white/15" : ""
                  } text-teal-200`}
                  style={{ fontSize: `${fontSize  - 6}px` }}
                >
                  {verse[8]}
                </div>}
                {hindiTeekaShabadArth && <div
                  className={`font-hindi ${
                    id === highlightId ? "bg-white/15" : ""
                  } text-sky-200`}
                  style={{ fontSize: `${fontSize  - 6}px` }}
                >
                  {verse[9]}
                </div>}
                {hindiTeekaBhavArth && <div
                  className={`font-hindi ${
                    id === highlightId ? "bg-white/15" : ""
                  } text-amber-200`}
                  style={{ fontSize: `${fontSize - 6}px` }}
                >
                  {verse[10]}
                </div>}
              </div>
            );
          })
        )}
      </div>

      <div
        className={`fixed bottom-4 right-4 z-50 transition-opacity duration-500 ${
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <SizeControlBtns setFontSize={setFontSize} />
      </div>

      <div
        className={`fixed bottom-4 left-4 z-50 transition-opacity duration-500 ${
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <AutoScroll containerRef={verseContainerRef} />
      </div>
    </div>
  );
}

export default ShabadView;
