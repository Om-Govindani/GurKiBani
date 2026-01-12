import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import BookmarkContext from "../contexts/BookmarkContext";
import LanguageContext from "../contexts/LanguageContext";
import HistoryContext from "../contexts/HistoryContext";

function SearchResults({ results, setQuery , onBaniResultClick}) {
  const [bookmarks] = useContext(BookmarkContext);
  const [language] = useContext(LanguageContext);
  const [history, setHistory] = useContext(HistoryContext);
  const navigate = useNavigate();

  const maxVisible = 4;
  const maxHeight = (language === "both" ? 110 : 60) * maxVisible;


  const isBookmarked = (result) => {
    return bookmarks.some((b) => b.romanChar === result.romanChar);
  };

  const handleNavigate = (result) => {
    setQuery("");

    const isQuickRef = result.id === "__quickref__";
    const isBaniResult = result.type === 'bani'; // 💥 Naya check

    if (result.id === "__secret_background__") {
      navigate("/__background");
      return;
    }

    
    // Logic 1: In-page Bani Search (Agar startId missing hai)
    if (!isQuickRef && !result.startId && onBaniResultClick) {
        onBaniResultClick(result.id); // BaniView mein scroll logic trigger karo
        return; // Navigation mat karo
    }

    // Logic 2: BaniView Navigation (Agar result SundarGutka se aaya hai)
    if (isBaniResult) {
      // result.id is like "Japuji Sahib-1"
      const [baniName, highlightId] = result.id.split('-');

      navigate(`/bani/${encodeURIComponent(baniName)}?from=search&highlight=${highlightId}`);
      return; 
    }

    // Logic 3: SGGS Navigation (Original logic, made safe)
    if (isQuickRef) {
      navigate(`/bani/${encodeURIComponent(result.devanagari)}?from=search`);
    } else {
      // ✅ Add to history (SGGS search ke liye)
      setHistory((prev) => {
        // newEntry ko turant yahan define karo
        const newEntry = {
          id: result.id,
          startId: result.startId,
        };

        // Remove if already exists
        const filtered = prev.filter((item) => item.id !== result.id);

        // Add to top
        return [newEntry, ...filtered]; 
        
      });

      // 3. Navigate to ShabadView
      navigate(`/shabad/${result.startId}?highlight=${result.id}&from=searchresults`);
    }
  };

  return (
    <div
      className={`w-full max-w-lg overflow-y-auto bg-zinc-800 rounded-b-2xl transition-all duration-300`}
      style={{ maxHeight: `${maxHeight}px` }}
    >


      {results.map((result, index) => {
        const isQuickRef = result.id === "__quickref__";
        const isBaniResult = result.type === 'bani';

        return (
          <div
            key={result.id + index}
            onClick={() => handleNavigate(result)}
            className={`relative px-4 py-3 border-y border-zinc-700 text-white text-sm cursor-pointer hover:bg-zinc-700/40 transition`}
          >
            {/* 📿 Simran Mala */}
            {(isQuickRef || isBaniResult) && (
              <div className="absolute top-1/2 -translate-y-1/2 right-2 text-orange-300 text-xl">
                📿
              </div>
            )}

            {/* ⭐ Bookmark */}
            {!isQuickRef && isBookmarked(result) && (
              <div className="absolute top-1/2 -translate-y-1/2 right-2 text-yellow-400 text-xl">
                ★
              </div>
            )}

            {language !== "hindi" && (
              <div className="font-gurmukhi text-violet-50 text-xl pr-3">
                {result.gurmukhi}
              </div>
            )}
            {language !== "gurmukhi" && (
              <div className="font-hindi text-xl text-orange-200 pr-3">
                {result.devanagari}
              </div>
            )}
            {!isQuickRef && (
              <div className="text-xs text-neutral-500 mt-1">
                Ang: {result.id.split("-")[0]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SearchResults;
