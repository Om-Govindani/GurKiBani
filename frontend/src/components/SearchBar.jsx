import { useState, useEffect, useContext } from "react";
import SGGSContext from "../contexts/SGGSContext";
import BookmarkContext from "../contexts/BookmarkContext";


function SearchBar({ results, setResults ,query , setQuery }) {
  const SGGS = useContext(SGGSContext);
  const [bookmarks] = useContext(BookmarkContext);

  const quickRefs = {
    "japji sahib": ["ਜਪੁਜੀ ਸਾਹਿਬ", "जपुजी साहिब"],
    "japjee sahib": ["ਜਪੁਜੀ ਸਾਹਿਬ", "जपुजी साहिब"],
    "chopai sahib": ["ਕਬਿਯੋ ਬਾਚ ਬੇਨਤੀ (ਚੌਪਈ)", "कबियो बाच बेनती (चौपई)"],
    "chaupai sahib": ["ਕਬਿਯੋ ਬਾਚ ਬੇਨਤੀ (ਚੌਪਈ)", "कबियो बाच बेनती (चौपई)"],
    "anand sahib": ["ਅਨੰਦੁ ਸਾਹਿਬ", "अनंदु साहिब"],
    "tav prasad savaiye": ["ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ (ਸ੍ਰਾਵਗ ਸੁਧ ਸਮੂਹ)", "त्व प्रसादि सवये (स्रावग सुध समूह)"],
    "jaap sahib": ["ਜਾਪੁ ਸਾਹਿਬ", "जापु साहिब"],
    "rehraas sahib": ["ਰਹਰਾਸਿ ਸਾਹਿਬ", "रहरासि साहिब"],
    "sohila sahib": ["ਸੋਹਿਲਾ ਸਾਹਿਬ", "सोहिला साहिब"],
    "sukhmani sahib": ["ਸੁਖਮਨੀ ਸਾਹਿਬ", "सुखमनी साहिब"],
    "salok mohalla 9": ["ਸਲੋਕ ਮਹਲਾ ੯", "सलोक महला ९"],
    "shlok mohalla 9": ["ਸਲੋਕ ਮਹਲਾ ੯", "सलोक महला ९"],
    "salok mehella 9": ["ਸਲੋਕ ਮਹਲਾ ੯", "सलोक महला ९"],
    "shlok mehella 9": ["ਸਲੋਕ ਮਹਲਾ ੯", "सलोक महला ९"],
    "salok mohala 9": ["ਸਲੋਕ ਮਹਲਾ ੯", "सलोक महला ९"],
    "shlok mohala 9": ["ਸਲੋਕ ਮਹਲਾ ੯", "सलोक महला ९"],
    "salok mehela 9": ["ਸਲੋਕ ਮਹਲਾ ੯", "सलोक महला ९"],
    "shlok mehela 9": ["ਸਲੋਕ ਮਹਲਾ ੯", "सलोक महला ९"],
    "ardas": ["ਅਰਦਾਸ", "अरदास"],
    "ardaas": ["ਅਰਦਾਸ", "अरदास"],
    "aarti" : ["ਆਰਤੀ","आरती"],
    "dukh bhanjan sahib" : ["ਦੁਖ ਭੰਜਨ ਸਾਹਿਬ","दुख भंजन साहिब"],
  };

  const handleSearch = () => {
    const raw = query.trim().toLowerCase();
    const normalizedChars = raw.includes(" ")
      ? raw.split(/\s+/)
      : raw.split("");

    if (normalizedChars.length < 3) {
      setResults([]);
      return;
    }

    const quickKey = Object.keys(quickRefs).find((key) =>
      key.startsWith(raw)
    );
    const quickRefResult = quickKey
      ? {
          id: "__quickref__",
          gurmukhi: quickRefs[quickKey][0],
          devanagari: quickRefs[quickKey][1],
          isQuickRef: true,
        }
      : null;

    const isMatch = (verseChars, inputChars) => {
      if (inputChars.length > verseChars.length) return false;
      for (let i = 0; i < inputChars.length; i++) {
        if (verseChars[i] !== inputChars[i]) return false;
      }
      return true;
    };

    const allMatches = [];
    for (const [id, verse] of Object.entries(SGGS)) {
      const verseRomanChars = verse[4].split(" ");
      if (isMatch(verseRomanChars, normalizedChars)) {
        allMatches.push({
          id,
          gurmukhi: verse[0],
          devanagari: verse[1],
          romanChar: verse[4],
          startId: verse[5],
          endId: verse[6],
        });
      }
    }

    const sortedResults = [
      ...(quickRefResult ? [quickRefResult] : []),
      ...allMatches.filter((res) =>
        bookmarks.some((b) => b.romanChar === res.romanChar)
      ),
      ...allMatches.filter(
        (res) => !bookmarks.some((b) => b.romanChar === res.romanChar)
      ),
    ];

    setResults(sortedResults);
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
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className={`w-full max-w-lg bg-zinc-800 h-14 flex transition-all duration-300
        ${hasResults ? "rounded-t-2xl rounded-b-none " : "rounded-2xl"} shadow-md shadow-stone-700/60`}
    >
      <input
        type="text"
        placeholder="Enter First Characters of Shabad"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value.toLowerCase());
        }}
        className={`w-6/7 h-full bg-zinc-800 text-white/80 px-6 py-4 placeholder:text-zinc-400 text-lg
          ${hasResults ? "rounded-tl-2xl rounded-bl-none" : "rounded-l-2xl"} outline-none`}
      />
      <button
        type="submit"
        className={`w-1/7 bg-zinc-400 cursor-pointer transition-all duration-300 hover:bg-white/40 active:scale-95 flex items-center justify-center
          ${hasResults ? "rounded-tr-2xl rounded-br-none" : "rounded-r-2xl"}`}
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </button>
    </form>
  );
}

export default SearchBar;
