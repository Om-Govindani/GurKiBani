import { useEffect, useContext, useState, useRef } from "react";
import SGGSContext from "../contexts/SGGSContext";
import LanguageContext from "../contexts/LanguageContext";
import TopBar from "../components/TopBar";
import SizeControlBtns from "../components/buttons/SizeControlBtns";
import AngContext from "../contexts/AngContext";

function SahajPaathView() {
  const SGGS = useContext(SGGSContext);
  const [ang, setAng] = useContext(AngContext);
  const [language] = useContext(LanguageContext);
  const [fontSize, setFontSize] = useState(24);
  const [highlightId, setHighlightId] = useState(null);
  const verseRefs = useRef({});

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

  // Handle verse click
  const handleVerseClick = (verseId) => {
    localStorage.setItem("sahajPaathRef", JSON.stringify({ ang, verseId }));
    setHighlightId(verseId);
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-900 flex-col px-2 py-5 select-none">
      <TopBar from="SahajPaath" ang={ang} setAng={setAng} />
      <div className="max-w-3xl mx-auto mt-20 space-y-6">
        {filteredVerses.map(([id, verse]) => (
          <div
            key={id}
            ref={(el) => (verseRefs.current[id] = el)}
            className={`flex flex-col gap-1 text-center p-2 rounded-xl transition-all duration-300 ${
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
          </div>
        ))}
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <SizeControlBtns setFontSize={setFontSize} />
      </div>
    </div>
  );
}

export default SahajPaathView;
