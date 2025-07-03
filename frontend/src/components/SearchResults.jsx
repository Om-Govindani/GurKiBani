import {useNavigate} from "react-router-dom"

function SearchResults({ results }) {
  const rowHeight = 100; 
  const maxVisible = 6;
  const calculatedHeight = Math.min(results.length, maxVisible) * rowHeight;
  const navigate = useNavigate();
  return (
    <div
      className={`w-full max-w-lg overflow-y-auto bg-zinc-800 rounded-b-2xl transition-all duration-300`}
      style={{ height: `${calculatedHeight}px` }} 
    >
      {results.map((result, index) => (
        <div
          key={result.id + index}
          onClick={() => navigate(`/shabad/${result.startId}?highlight=${result.id}`)}
          className={`px-4 py-3 border-y border-zinc-700 text-white text-sm`}
        >
          <div className={`font-gurmukhi text-violet-50 text-xl`}>{result.gurmukhi}</div>
          <div className={`font-hindi text-xl  text-orange-200`}>{result.devanagari}</div>
          <div className={`text-xs text-neutral-500 mt-1`}>Ang: {result.id.split("-")[0]}</div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
