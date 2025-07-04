import { useParams  , useSearchParams } from "react-router-dom";
import { useContext  , useState , useEffect , useRef} from "react";
import UserContext from "../contexts/SGGSContext";
import SizeControlBtns from "../components/buttons/SizeControlBtns";
import TopBar from "../components/TopBar";

function ShabadView() {
  const { startId } = useParams();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight")
  const SGGS = useContext(UserContext);
  const [fontSize , setFontSize] = useState(24);
  const [showControls, setShowControls] = useState(true);
  const scrollTimeoutRef = useRef(null);
  const verseRef = useRef({})
  
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
    <div className="h-screen w-full bg-neutral-900 text-white px-2 py-5 relative flex-col">

      <TopBar highlightId = {highlightId}/>


        
      <div className="w-full h-full mx-auto relative overflow-y-scroll">
        <div className="h-10"></div>
        {shabadVerses.map(([id, verse], index) => {
          const isFirst = index === 0;
          const isLast = index === shabadVerses.length - 1;

          return (
            <div
              key={id}
              ref={(el) => (verseRef.current[id] = el)}
              className={`py-4 transition-all duration-200
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
        <SizeControlBtns setFontSize = {setFontSize} />
      </div>

    </div>
  );
}

export default ShabadView;
