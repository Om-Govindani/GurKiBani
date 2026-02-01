import { useNavigate } from "react-router-dom";
import BookmarkBtn from "./buttons/BookmarkBtn";
import { useContext, useState, useEffect , useRef } from "react";
import BookmarkContext from "../contexts/BookmarkContext";
import AngContext from "../contexts/AngContext";
import SGGSContext from "../contexts/SGGSContext";
import LanguageContext from "../contexts/LanguageContext";
import HistoryContext from "../contexts/HistoryContext";
import { HiDotsVertical } from "react-icons/hi";
import { HiTrash } from "react-icons/hi";
import { FiArrowLeftCircle, FiArrowRightCircle , FiSearch } from 'react-icons/fi';
import { HiChevronDown, HiChevronUp } from "react-icons/hi"; // ⬇️⬆️ icons
import { FaCaretUp } from "react-icons/fa";
import EngTranslitrationContext from "../contexts/EngTranslitrationContext";
import HindiTeekaBhavArthContext from "../contexts/HindiTeekaBhavArthContext";
import HindiTeekaShabadArthContext from "../contexts/HindiTeekaShabadArthContext";
import HindiTranslationContext from "../contexts/HindiTranslationContext";





function TopBar({ highlightId, from , containerRef , onSearchToggle}) {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useContext(BookmarkContext);
  const [ang, setAng] = useContext(AngContext);
  
  const SGGS = useContext(SGGSContext);
  const [language, setLanguage] = useContext(LanguageContext);
  const found = bookmarks.some((b) => b.highlightId === highlightId);
  const [isBookmark, setIsBookmark] = useState(found);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [showAngInput, setShowAngInput] = useState(false);

  const [engTranslitration, setEngTranslitration] = useContext(EngTranslitrationContext);
  const [hindiTeekaBhavArth, setHindiTeekaBhavArth] = useContext(HindiTeekaBhavArthContext);
  const [hindiTeekaShabadArth, setHindiTeekaShabadArth] = useContext(HindiTeekaShabadArthContext);
  const [hindiTranslation, setHindiTranslation] = useContext(HindiTranslationContext);
  const [history, setHistory] = useContext(HistoryContext);
  const settingsRef = useRef();
  const buttonRef = useRef();
const angInputRef = useRef();

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
            from === "history" ? navigate("/history") :
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
        <div className="flex items-center space-x-2 relative">

          {(from === "bani" || from === "search") && (
            <button
              className="p-1 text-white"
              onClick={onSearchToggle}
              title="Search Bani"
            >
              <FiSearch size={24} />
            </button>
          )}

          {(from === "searchresults" || from === "bookmarks" || from === "history") && (
            <>
              <div className="text-xl text-white font-gurmukhi">
                ਅੰਗ: {convertToGurmukhiNumber(highlightId.split("-")[0])}
              </div>
              <BookmarkBtn isBookmark={isBookmark} onToggle={handleBookmarkToggle} />
            </>
          )}

          {from === "historyView" && (
            <button
              className="text-white p-1"
              onClick={() => setHistory([])}
              title="Clear History"
            >
              <HiTrash size={22} />
            </button>
          )}

          {from === "SahajPaath" && (
            <>
              

              <button
                className="text-white"
                onClick={() => {
                  const newAng = Math.max(1, Number(ang) - 1);
                  setAng(String(newAng));
                }}
                title="Previous Ang"
              >
                <FiArrowLeftCircle size={28} />
              </button>

              <button
                className="text-white p-1"
                onClick={() => {
                  const newAng = Math.min(1430, Number(ang) + 1);
                  setAng(String(newAng));
                }}
                title="Next Ang"
              >
                <FiArrowRightCircle size={28} />
              </button>

              {/* 🔍 Inline ang search input */}
              <div className="flex items-center">
                {showAngInput ? (
                  <input
                    type="number"
                    ref={angInputRef}
                    min="1"
                    max="1430"
                    placeholder="Ang"
                    className="bg-white/80 text-zinc-800 px-2 py-1 rounded-md w-20 border border-zinc-600 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const num = parseInt(e.target.value);
                        if (num >= 1 && num <= 1430) {
                          setAng(String(num));
                          setShowAngInput(false);
                        }
                      }
                    }}
                    onBlur={() => setShowAngInput(false)}
                    autoFocus
                  />
                ) : (
                  <button
                    className="text-white"
                    onClick={() => setShowAngInput(true)}
                    title="Search Ang"
                  >
                    <FiSearch size={24} />
                  </button>
                )}
              </div>
              <div className="text-white text-lg sm:block">
                ਅੰਗ: {convertToGurmukhiNumber(ang)}
              </div>
            </>
          )}


          {containerRef && (
            <button
              onClick={() => {
                containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="p-1 text-white"
              title="Scroll to Top"
            >
              <FaCaretUp size={30} />
            </button>
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
              <div
                ref={settingsRef}
                className="absolute right-0 top-8 bg-zinc-900 text-white border border-zinc-700 rounded-md shadow-lg w-48 z-50"
              >
                {/* Default options */}
                {["both", "hindi", "gurmukhi"].map((lang) => (
                  <div
                    key={lang}
                    className={`px-4 py-2 cursor-pointer hover:bg-zinc-800 transition ${
                      language === lang ? "bg-zinc-700" : ""
                    }`}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </div>
                ))}

                {/* Advance option */}
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-zinc-800 flex justify-between items-center"
                  onClick={() => setShowAdvance(prev => !prev)}
                >
                  <span>Advance</span>
                  {showAdvance ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
                </div>

                {/* Advance sub-options (checkboxes) */}
                {showAdvance && (
                  <div className="px-4 py-2 space-y-2 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={engTranslitration === true}
                        onChange={(e) =>{ setEngTranslitration(e.target.checked ? true : false); }}
                      />
                      <span>Eng. Transliteration</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hindiTranslation === true}
                        onChange={(e) => setHindiTranslation(e.target.checked ? true : false)}
                      />
                      <span>Hindi Translation</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hindiTeekaShabadArth === true}
                        onChange={(e) => setHindiTeekaShabadArth(e.target.checked ? true : false)}
                      />
                      <span>Shabad Arth</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hindiTeekaBhavArth === true}
                        onChange={(e) => setHindiTeekaBhavArth(e.target.checked ? true : false)}
                      />
                      <span>Bhav Arth</span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;