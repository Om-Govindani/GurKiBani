import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import SearchResults from "../components/SearchResults.jsx";
import HamburgerMenu from "../components/HamburgerMenu.jsx";
import LanguageContext from "../contexts/LanguageContext.js";
import { MdSettings, MdRefresh } from "react-icons/md";
import { RiInformation2Fill } from "react-icons/ri";

function SearchView() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [language, setLanguage] = useContext(LanguageContext);
  const settingsRef = useRef();
  const buttonRef = useRef();
  const navigate = useNavigate();

  // 👇 PWA install handling
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // ✅ detect if already running as standalone (PWA)
  const isInStandaloneMode =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  useEffect(() => {
    // language menu outside click close
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

  useEffect(() => {
    // listen for install event
    const handler = (e) => {
      if (isInStandaloneMode) return; // 🚫 don't show install button inside PWA
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isInStandaloneMode]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("User choice:", outcome);
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  return (
    <div className="relative bg-transparent py-4 flex flex-col items-center justify-center px-4 h-screen w-full overflow-hidden">
      <HamburgerMenu />
      <SearchBar
        results={results}
        setResults={setResults}
        query={query}
        setQuery={setQuery}
      />
      <SearchResults results={results} setQuery={setQuery} />

      {/* 🔥 Top-right controls */}
      <div className="fixed top-6 right-4 flex flex-col items-end space-y-2">
        {/* Row: i button + gear button */}
        <div className="flex space-x-1">
          <button
            onClick={() => navigate("/Instructions")}
            aria-label="Instruction"
            className="p-1 md:text-zinc-800 text-white cursor-pointer"
          >
            <RiInformation2Fill size={30} />
          </button>

          <button
            onClick={() => setShowLangMenu((prev) => !prev)}
            className="p-1 md:text-zinc-800 text-white cursor-pointer"
            aria-label="Language Menu"
            ref={buttonRef}
          >
            <MdSettings size={30} />
          </button>
        </div>

        {/* Install button (just below) */}
        {showInstallBtn && (
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 bg-zinc-700 text-white rounded-md shadow-md"
          >
            Install
          </button>
        )}
      </div>

      {/* Settings Menu */}
      {showLangMenu && (
        <div
          ref={settingsRef}
          className="absolute right-1 top-20 bg-zinc-800 text-white border border-zinc-700 rounded-md shadow-lg w-40 z-50"
        >
          {["both", "hindi", "gurmukhi"].map((lang) => (
            <div
              key={lang}
              className={`px-4 py-2 cursor-pointer hover:bg-zinc-700/40 transition ${
                language === lang ? "bg-zinc-700/60" : ""
              }`}
              onClick={() => handleLanguageChange(lang)}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </div>
          ))}

          {/* 🔄 Refresh Option */}
          <div
            className="px-4 py-2 cursor-pointer hover:bg-zinc-700/40 transition text-red-300 border-t border-zinc-700"
            onClick={handleRefresh}
          >
            <div className="flex justify-center items-center">
              <MdRefresh size={18} className="mr-2" /> Refresh App
            </div>
          </div>
        </div>
      )}

      <h2 className="absolute bottom-4 text-center text-white/80 mb-4 -z-1">
        Sewa With ❤️ by Govindani&apos;s
      </h2>
    </div>
  );
}

export default SearchView;
