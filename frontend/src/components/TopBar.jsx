import { useNavigate } from "react-router-dom";
import BookmarkBtn from "./buttons/BookmarkBtn";
import { useContext, useState, useEffect , useRef } from "react";
import BookmarkContext from "../contexts/BookmarkContext";
import SGGSContext from "../contexts/SGGSContext";
import LanguageContext from "../contexts/LanguageContext";
import { HiDotsVertical } from "react-icons/hi";

function TopBar({ highlightId, from }) {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useContext(BookmarkContext);
  const SGGS = useContext(SGGSContext);
  const [language, setLanguage] = useContext(LanguageContext);
  const found = bookmarks.some((b) => b.highlightId === highlightId);
  const [isBookmark, setIsBookmark] = useState(found);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const settingsRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowLangMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  function convertToGurmukhiNumber(num) {
    const gurmukhiDigits = ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'];
    return num
      .split('')
      .map(digit => gurmukhiDigits[parseInt(digit, 10)])
      .join('');
  }

  useEffect(() => {
    setIsBookmark(found);
  }, [highlightId, bookmarks]);

  const handleBookmarkToggle = () => {
    if (!SGGS[highlightId]) return;

    const newState = !isBookmark;
    setIsBookmark(newState);

    setBookmarks(prev => {
      if (newState) {
        if (!prev.some(b => b.highlightId === highlightId)) {
          return [...prev, {
            highlightId,
            romanChar: SGGS[highlightId][4]
          }];
        }
      } else {
        return prev.filter(b => b.highlightId !== highlightId);
      }
      return prev;
    });
  };

  useEffect(() => {
    setBookmarks((prev) => {
      const alreadyBookmarked = prev.some((b) => b.highlightId === highlightId);

      if (isBookmark && !alreadyBookmarked) {
        return [...prev, { highlightId, romanChar: SGGS[highlightId][4] }];
      } else if (!isBookmark && alreadyBookmarked) {
        return prev.filter((b) => b.highlightId !== highlightId);
      }
      return prev;
    });
  }, [isBookmark, highlightId, SGGS]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 px-2 flex items-center min-h-[72px] bg-black/5 border-b-1 border-zinc-700/60"
      style={{
        paddingTop: `calc(env(safe-area-inset-top ,0px))`,
        paddingBottom: "0.5rem",
        WebkitBackdropFilter: 'blur(8px)',
        backdropFilter: 'blur(8px)',
        transform: 'translateZ(0)'
      }}
    >
      <div className="w-full mx-auto h-fit flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={() => {
            from === "bookmarks" ? navigate("/bookmarks") :
            from === "bani" ? navigate("/nitnem") :
            navigate("/reset")
          }}
          className="flex items-center text-white transition text-xl"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Right Side */}
        <div className="flex items-center space-x-3 relative">
          {(from === "searchresults" || from === "bookmarks") && (
            <>
              <div className="text-xl text-white font-gurmukhi">
                ਅੰਗ: {convertToGurmukhiNumber(highlightId.split("-")[0])}
              </div>
              <BookmarkBtn isBookmark={isBookmark} onToggle={handleBookmarkToggle} />
            </>
          )}

          {/* 3-dot menu */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(prev => !prev)}
              className="p-1 text-white"
              aria-label="Language Menu"
              ref={buttonRef}
            >
              <HiDotsVertical size={22} />
            </button>
            {showLangMenu && (
              <div ref={settingsRef} className="absolute right-0 top-8 bg-zinc-900 text-white border border-zinc-700 rounded-md shadow-lg w-40 z-50">
                {["both", "hindi", "gurmukhi"].map((lang) => (
                  <div
                    key={lang}
                    className={`px-4 py-2 cursor-pointer hover:bg-zinc-800 transition ${
                      language === lang ? "bg-zinc-700" : ""
                    }`}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
