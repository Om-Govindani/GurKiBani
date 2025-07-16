import { useParams, useSearchParams } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../contexts/SGGSContext";
import SizeControlBtns from "../components/buttons/SizeControlBtns";
import TopBar from "../components/TopBar";
import LanguageContext from "../contexts/LanguageContext";

function ShabadView() {
  const { startId } = useParams();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const from = searchParams.get("from");
  const SGGS = useContext(UserContext);
  const [fontSize, setFontSize] = useState(24);
  const [showControls, setShowControls] = useState(true);
  const verseRef = useRef({});
  const [language] = useContext(LanguageContext);

  const RAAG_NAMES = [
    "ਰਾਗੁ", "ਸ੍ਰੀ", "ਮਾਝ", "ਗਉੜੀ", "ਆਸਾ", "ਗੁਜਰੀ", "ਦੇਵਗੰਧਾਰੀ", "ਬਿਹਾਗੜਾ",
    "ਵਡਹੰਸ", "ਸੋਰਠ", "ਧਨਾਸਰੀ", "ਜੈਜਾਵੰਤੀ", "ਤਿਲੰਗ", "ਸੁਹੀ", "ਬਿਲਾਵਲ",
    "ਗੋਂਡ", "ਰਾਮਕਲੀ", "ਭੈਰਉ", "ਬਸੰਤ", "ਸਾਰੰਗ", "ਬੈਰਾਰੀ"
  ];

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

  const shabadVerses = Object.entries(SGGS).filter(
    ([id, verse]) => verse[5] === startId
  );

  const shouldHighlightFirstVerse = (() => {
    const firstVerse = shabadVerses[0]?.[1]?.[0] || "";
    return [...RAAG_NAMES, ...SECTION_KW].some((kw) => firstVerse.includes(kw));
  })();

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white px-2 py-5 relative flex-col">
      <TopBar highlightId={highlightId} from={from} />

      <div className="w-full h-full mx-auto mt-[20px] relative overflow-y-scroll">
        <div className="h-10"></div>
        {shabadVerses.length === 0 ? (
          <EmptyPage title={"Some technical issue"} content={"This will be fixed soon"} />
        ) : (
          shabadVerses.map(([id, verse], index) => {
            const isFirstVerse = index === 0;
            const applySpecialColor = isFirstVerse && shouldHighlightFirstVerse;

            return (
              <div
                key={id}
                ref={(el) => (verseRef.current[id] = el)}
                className={`py-2 transition-all duration-200 text-center`}
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
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {verse[1]}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div
        className={`fixed bottom-4 right-4 z-50 group transition-opacity duration-500 ${
          showControls ? "opacity-50 hover:opacity-100" : "opacity-0"
        }`}
      >
        <SizeControlBtns setFontSize={setFontSize} />
      </div>
    </div>
  );
}

export default ShabadView;
