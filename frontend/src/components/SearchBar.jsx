import { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";

function SearchBar({ results, setResults }) {
  const [query, setQuery] = useState("");
  const SGGS = useContext(UserContext);

  const handleSearch = (e) => {
  if (e) e.preventDefault();

  const cleanedQuery = query.trim();

  // ✅ If query is empty, clear results and return
  if (cleanedQuery === "") {
    setResults([]);
    return;
  }

  const inputChar = cleanedQuery.split(" ").filter((c) => c !== "");
  if (inputChar.length < 3) {
    setResults([]);
    return;
  }
  const isMatch = (verseChars, inputChars) => {
    if (inputChars.length > verseChars.length) return false;
    for (let i = 0; i < inputChars.length; i++) {
      if (verseChars[i] !== inputChars[i]) return false;
    }
    return true;
  };

  const tempResults = [];

  for (const [id, verse] of Object.entries(SGGS)) {
    const letters = verse[4].split(" ");
    if (isMatch(letters, inputChar)) {
      tempResults.push({
        id,
        gurmukhi: verse[0],
        devanagari: verse[1],
        startId: verse[5],
        endId: verse[6],
      });
    }
  }

  setResults(tempResults);
  console.log(results)
};

useEffect(() => {
    const delay = setTimeout(() => {
        handleSearch();
    }, 200);

    return () => clearTimeout(delay);
    }, [query]);
    const hasResults = results.length > 0;


  return (
    <form
      onSubmit={handleSearch}
      className={`w-full max-w-lg bg-zinc-800 h-14 flex transition-all duration-300
        ${hasResults ? "rounded-t-2xl rounded-b-none " : "rounded-2xl"}`}
    >
      <input
        type="text"
        placeholder="Enter First Characters of Shabad"
        value={query}
        onChange={(e) => {
          
          setQuery(e.target.value.toLowerCase());
          handleSearch();
        }}
        className={`w-full h-full bg-zinc-800 text-white/80 px-6 py-4 placeholder:text-zinc-400 text-lg
          ${hasResults ? "rounded-tl-2xl rounded-bl-none" : "rounded-l-2xl"} outline-none`}
      />
      <button
        type="submit"
        className={`w-1/3 bg-zinc-400 cursor-pointer transition-all duration-300 hover:bg-white/40 active:scale-95
          ${hasResults ? "rounded-tr-2xl rounded-br-none" : "rounded-r-2xl"}`}
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
