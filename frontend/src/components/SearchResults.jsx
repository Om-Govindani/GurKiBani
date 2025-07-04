import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import BookmarkContext from "../contexts/BookmarkContext";

function SearchResults({ results }) {
  const [bookmarks] = useContext(BookmarkContext);
  const rowHeight = 100; 
  const maxVisible = 6;
  const calculatedHeight = Math.min(results.length, maxVisible) * rowHeight;
  const navigate = useNavigate();

  // 🔍 Function to check if result is bookmarked
  const isBookmarked = (result) => {
    return bookmarks.some((b) => b.romanChar === result.romanChar);
  };

  return (
    <div
      className={`w-full max-w-lg overflow-y-auto bg-zinc-800 rounded-b-2xl transition-all duration-300`}
      style={{ height: `${calculatedHeight}px` }} 
    >
      {results.map((result, index) => (
        <div
          key={result.id + index}
          onClick={() => navigate(`/shabad/${result.startId}?highlight=${result.id}`)}
          className={`relative px-4 py-3 border-y border-zinc-700 text-white text-sm cursor-pointer hover:bg-zinc-700/40 transition`}
        >
          {/* ⭐️ Bookmark icon */}
          {isBookmarked(result) && (
            <div className="absolute top-1/2 -translate-y-1/2 right-2 text-yellow-400 text-xl ">
              ★
            </div>
          )}

          <div className={`font-gurmukhi text-violet-50 text-xl pr-3`}>{result.gurmukhi}</div>
          <div className={`font-hindi text-xl text-orange-200 pr-3`}>{result.devanagari}</div>
          <div className={`text-xs text-neutral-500 mt-1`}>Ang: {result.id.split("-")[0]}</div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
