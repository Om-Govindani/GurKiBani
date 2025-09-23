import { useEffect, useContext, useState, useRef } from "react";
import SGGSContext from "../contexts/SGGSContext";
import LanguageContext from "../contexts/LanguageContext";
import TopBar from "../components/TopBar";
import SizeControlBtns from "../components/buttons/SizeControlBtns";
import AngContext from "../contexts/AngContext";
import FontSizeContext from "../contexts/FontSizeContext";
import EngTranslitrationContext from "../contexts/EngTranslitrationContext";
import HindiTeekaBhavArthContext from "../contexts/HindiTeekaBhavArthContext";
import HindiTeekaShabadArthContext from "../contexts/HindiTeekaShabadArthContext";
import HindiTranslationContext from "../contexts/HindiTranslationContext";
import AutoScroll from "../components/buttons/AutoScroll";

function SahajPaathView() {
  const SGGS = useContext(SGGSContext);
  const [ang, setAng] = useContext(AngContext);
  const [language] = useContext(LanguageContext);
  const [fontSize, setFontSize] = useContext(FontSizeContext);
  const [engTranslitration] = useContext(EngTranslitrationContext);
  const [hindiTeekaBhavArth] = useContext(HindiTeekaBhavArthContext);
  const [hindiTeekaShabadArth] = useContext(HindiTeekaShabadArthContext);
  const [hindiTranslation] = useContext(HindiTranslationContext);
  const [highlightId, setHighlightId] = useState(null);
  const verseRefs = useRef({});
  const verseContainerRef = useRef(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const timeoutRef = useRef(null);


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

  // Filter and sort verses for current ang
  const filteredVerses = Object.entries(SGGS)
    .filter(([key]) => key.startsWith(`${String(ang).trim()}-`))
    .sort((a, b) => {
      const [, lineA, verseA] = a[0].split("-").map(Number);
      const [, lineB, verseB] = b[0].split("-").map(Number);
      if (lineA !== lineB) return lineA - lineB;
      return verseA - verseB;
    });

  // Scroll to stored verse on load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sahajPaathRef"));
    if (saved?.ang === String(ang) && saved?.verseId) {
      setHighlightId(saved.verseId);
      setTimeout(() => {
        const el = verseRefs.current[saved.verseId];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [ang]);

  // Clear highlight after few seconds
  useEffect(() => {
    if (highlightId) {
      const timeout = setTimeout(() => setHighlightId(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [highlightId]);


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
            if (delta > 0) {
                setFontSize((f) => Math.min(f + 6, 48));
            } else {
                setFontSize((f) => Math.max(f - 6, 12));
            }
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


  // Handle verse click
  const handleVerseClick = (verseId) => {
    localStorage.setItem("sahajPaathRef", JSON.stringify({ ang, verseId }));
    setHighlightId(verseId);
  };

  return (
    <div className="relative h-screen w-full bg-neutral-900 flex-col px-2 py-5 select-none">
      <TopBar from="SahajPaath" ang={ang} setAng={setAng} />
      <div className="mx-auto mt-[20px] w-full h-full overflow-y-scroll"
        ref = {verseContainerRef}
      >
        <div className="h-10"></div>
        {filteredVerses.map(([id, verse]) => (
          <div
            key={id}
            ref={(el) => (verseRefs.current[id] = el)}
            className={`max-w-3xl mx-auto flex flex-col gap-1 text-center py-1.5 rounded-xl transition-all duration-300 ${
              highlightId === id ? "bg-white/15" : ""
            }`}
            onClick={() => handleVerseClick(id)}
            onTouchStart={(e) => e.preventDefault()} // disables text selection on long press
          >
            {language !== "hindi" && (
              <div
                style={{ fontSize: `${fontSize}px` }}
                className="font-gurmukhi text-violet-50"
              >
                {verse[0]}
              </div>
            )}
            {language !== "gurmukhi" && (
              <div
                style={{ fontSize: `${fontSize - 2}px` }}
                className="font-hindi text-orange-200"
              >
                {verse[1]}
              </div>
            )}
            {engTranslitration && <div
              className={`font-hindi text-gray-300 italic`}
              style={{ fontSize: `${fontSize - 2}px` }}
            >
              {verse[7]}
            </div>}
            {hindiTranslation && <div
              className={`font-hindi text-teal-200`}
              style={{ fontSize: `${fontSize  - 6}px` }}
            >
              {verse[8]}
            </div>}
            {hindiTeekaShabadArth && <div
              className={`font-hindi text-sky-200`}
              style={{ fontSize: `${fontSize  - 6}px` }}
            >
              {verse[9]}
            </div>}
            {hindiTeekaBhavArth && <div
              className={`font-hindi text-amber-200`}
              style={{ fontSize: `${fontSize - 6}px` }}
            >
              {verse[10]}
            </div>}
            
          </div>
        ))}
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

export default SahajPaathView;
