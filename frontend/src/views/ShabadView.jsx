import { useParams  , useSearchParams , useNavigate} from "react-router-dom";
import { useContext  , useState , useEffect , useRef} from "react";
import UserContext from "../contexts/UserContext";

function ShabadView() {
  const { startId } = useParams();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight")
  const SGGS = useContext(UserContext);
  const [fontSize , setFontSize] = useState(24);
  const [showControls, setShowControls] = useState(true);
  const scrollTimeoutRef = useRef(null);
  const verseRef = useRef({})
  const navigate = useNavigate()
  
  useEffect(() => {
    const handleScroll = () => {
        setShowControls(true);
        if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        }, 3000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
    }, []);

  useEffect(()=>{
    if(highlightId && verseRef.current[highlightId]){
        verseRef.current[highlightId].scrollIntoView({
            behavior : "smooth",
            block : "center"
        })
    }
  },[highlightId])

  const shabadVerses = Object.entries(SGGS).filter(
    ([id, verse]) => verse[5] === startId
  );

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white px-6 py-10">

      <div className="w-full mx-auto flex items-center justify-between mb-4">
        {/* Back Button (top left) */}
        <button
            onClick={() => navigate("/")}
            className="flex items-center text-zinc-400 hover:text-white transition text-xl"
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

        {/* Gurmukhi Ang Number (top right) */}
        <div className="text-xl text-white/80 font-gurmukhi">
            ਅੰਗ: {highlightId.split("-")[0]}
        </div>
      </div>


        
      <div className="w-full mx-auto relative ">

        {shabadVerses.map(([id, verse], index) => {
          const isFirst = index === 0;
          const isLast = index === shabadVerses.length - 1;

          return (
            <div
              key={id}
              ref={(el) => (verseRef.current[id] = el)}
              className={`p-4 transition-all duration-200
                ${isFirst ? "rounded-t-lg" : ""}
                ${isLast ? "rounded-b-lg" : ""}
                ${!isLast ? "border-b-0" : ""}
            text-center
            `}

            >
              <div 
                className={`font-gurmukhi ${id == highlightId ? "bg-white/15":""} text-violet-50`}
                style={{fontSize : `${fontSize}px` , lineHeight:"1.4"}}
              >{verse[0]}</div>
              <div 
                className={`font-hindi ${id == highlightId ? "bg-white/15":"mt-1"} text-orange-200 `}
                style={{fontSize : `${fontSize }px`}}
              >{verse[1]}</div>
            </div>
          );
        })}


      </div>
      <div
        className={`fixed bottom-4 right-4 z-50 group transition-opacity duration-500 ${
          showControls ? "opacity-50 hover:opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center bg-zinc-600/80 backdrop-blur-sm shadow-lg border border-zinc-600 rounded-full overflow-hidden group-hover:opacity-100">
          <button
            onClick={() => setFontSize((s) => Math.min(s + 2, 48))}
            className="text-white px-4 py-2 text-xl hover:bg-zinc-600 transition"
          >
            +
          </button>
          <div className="w-px h-6 bg-zinc-500" />
          <button
            onClick={() => setFontSize((s) => Math.max(s - 2, 14))}
            className="text-white px-4 py-2 text-xl hover:bg-zinc-600 transition"
          >
            −
          </button>
        </div>
      </div>

    </div>
  );
}

export default ShabadView;
