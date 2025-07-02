import {useNavigate} from "react-router-dom"

function SearchResults({ results }) {
  const rowHeight = 96; 
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
          className={`px-4 py-3 border-b ${index % 2 ? "bg-white/40 text-black" : "bg-zinc-800 text-white"} border-zinc-700 text-white text-sm`}
        >
          <div className={`font-gurmukhi ${index % 2 ? "text-neutral-900" : "text-zinc-400"} text-xl`}>{result.gurmukhi}</div>
          <div className={`font-hindi text-sm  ${index % 2 ? "text-neutral-900" : "text-zinc-400"}`}>{result.devanagari}</div>
          <div className={`text-xs ${index % 2 ? "text-neutral-700" : "text-zinc-500"} mt-1`}>Ang: {result.id.split("-")[0]}</div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
