import { useState, useEffect, useContext, useRef } from "react";
import SGGSContext from "../contexts/SGGSContext";
import BookmarkContext from "../contexts/BookmarkContext";

function SearchBar({ results, setResults, query, setQuery }) {
  const SGGS = useContext(SGGSContext);
  const [bookmarks] = useContext(BookmarkContext);

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const stopTimerRef = useRef(null);

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
    "aarti": ["ਆਰਤੀ", "आरती"],
    "dukh bhanjan sahib": ["ਦੁਖ ਭੰਜਨੀ ਸਾਹਿਬ", "दुख भंजनी साहिब"],
  };

  // --- Normalize Hinglish/English transcript to first letters ---
  const normalizeEnglish = (text) =>
    text
      .replace(/[^a-zA-Z\s]/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0].toLowerCase())
      .join("");

  // --- Voice: start listening for 10 seconds ---
  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    // Create once per start
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Hinglish treated as English
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true; // keep mic open up to 10s

    recognitionRef.current = recognition;
    setListening(true);

    recognition.start();

    // Auto-stop after 10 seconds
    stopTimerRef.current = setTimeout(() => {
      stopListening();
    }, 10000);

    recognition.onresult = (event) => {
      // Take the last final result (best effort)
      const resIndex = event.results.length - 1;
      const transcript = event.results[resIndex][0].transcript || "";
      const normalized = normalizeEnglish(transcript);
      if (normalized) setQuery(normalized); // triggers existing search
    };

    recognition.onerror = () => {
      stopListening();
    };

    recognition.onend = () => {
      // If it ended unexpectedly while we still think we're listening, clean up state
      if (listening) setListening(false);
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }
    };
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch (_) {}
    }
    recognitionRef.current = null;
    setListening(false);
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    };
  }, []);

  // --- Your existing search logic (unchanged) ---
  const handleSearch = () => {
    const raw = query.trim().toLowerCase();
    const normalizedChars = raw.includes(" ") ? raw.split(/\s+/) : raw.split("");

    if (normalizedChars.length < 3) {
      setResults([]);
      return;
    }

    const quickKey = Object.keys(quickRefs).find((key) => key.startsWith(raw));
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
      const verseHindiChars = verse[3].split(" ");
      const verseGurmukhiChars = verse[2].split(" ");
      if (
        isMatch(verseRomanChars, normalizedChars) ||
        isMatch(verseHindiChars, normalizedChars) ||
        isMatch(verseGurmukhiChars, normalizedChars)
      ) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* Mic / Stop button */}
      {!listening ? (
        <button
          type="button"
          onClick={startListening}
          className={`w-1/7 bg-zinc-400 cursor-pointer transition-all duration-300 hover:bg-white/40 active:scale-95 flex items-center justify-center
            ${hasResults ? "rounded-tr-2xl rounded-br-none" : "rounded-r-2xl"}`}
          aria-label="Start voice search"
          title="Start voice search"
        >
          {/* Mic icon - white */}
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
            <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={stopListening}
          className={`w-1/7 bg-red-500 cursor-pointer transition-all duration-300 hover:bg-red-400 active:scale-95 flex items-center justify-center
            ${hasResults ? "rounded-tr-2xl rounded-br-none" : "rounded-r-2xl"}`}
          aria-label="Stop voice search"
          title="Stop voice search"
        >
          {/* White cross icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </form>
  );
}

export default SearchBar;
