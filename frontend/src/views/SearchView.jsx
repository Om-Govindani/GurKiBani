import {useState , useContext , useRef,useEffect} from "react";
import SearchBar from "../components/SearchBar.jsx"
import SearchResults from "../components/SearchResults.jsx";
import HamburgerMenu from "../components/HamburgerMenu.jsx";
import LanguageContext from "../contexts/LanguageContext.js";
import { MdSettings  , MdRefresh} from "react-icons/md";

function SearchView (){
    const [results , setResults] = useState([]) ;
    const [query, setQuery] = useState("");
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [language, setLanguage] = useContext(LanguageContext);
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
    

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setShowLangMenu(false);
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="relative bg-transparent py-4 flex flex-col items-center justify-center px-4 h-screen w-full overflow-hidden">
            <HamburgerMenu />
            <SearchBar results={results} setResults={setResults} query={query} setQuery={setQuery} />
            <SearchResults results={results} setQuery={setQuery} />

            {/* Settings Button */}
            <button
                onClick={() => setShowLangMenu(prev => !prev)}
                className="p-1 md:text-zinc-800 text-white fixed top-6 right-4"
                aria-label="Language Menu"
                ref={buttonRef}
                style={{
                    paddingTop: `calc(env(safe-area-inset-top ,0px))`,
                    paddingBottom: "0.5rem",
                    transform: 'translateZ(0)'
                }}
            >
                <MdSettings size={30} />
            </button>

            {/* Settings Menu */}
            {showLangMenu && (
                <div 
                    ref={settingsRef} 
                    className="absolute right-1 top-14 bg-zinc-800 text-white border border-zinc-700 rounded-md shadow-lg w-40 z-50"
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
                        className="px-4 py-2 cursor-pointer hover:bg-zinc-700/40 transition text-red-300 border-t-1 border-zinc-700"
                        onClick={handleRefresh}
                    >
                        <div className="flex justify-center items-center"><MdRefresh size={18} className="mr-2" /> Refresh App </div>
                    </div>
                </div>
            )}

            <h2 className="absolute bottom-4 text-center text-white/80 mb-4 -z-1">
                Sewa With ❤️ by Om Govindani
            </h2>
        </div>
    )
}

export default SearchView;
