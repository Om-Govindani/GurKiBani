import {useState , useContext, useEffect , useRef} from "react"
import {useParams ,useSearchParams} from "react-router-dom"
import TopBar from "../components/TopBar";
import SundarGutka from "../../public/SundarGutka.json"
import SizeControlBtns from "../components/buttons/SizeControlBtns";
import LanguageContext from "../contexts/LanguageContext";

function BaniView(){
    const { name } = useParams(); 
    const decodedName = decodeURIComponent(name); 
    const baniVerses = Object.entries(SundarGutka[decodedName]) || {};
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from");
    const [fontSize , setFontSize] = useState(24);
    const [showControls, setShowControls] = useState(true);
    const [language] = useContext(LanguageContext);
    const topBarRef = useRef(null);

    const keywords = ["ੴ",]

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
    const handleKeyDown = (e) => {
      if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;

      const topBarHeight = topBarRef.current?.offsetHeight || 72; // fallback
      const scrollAmount = window.innerHeight - topBarHeight;

      if (e.key === "ArrowRight") {
        window.scrollBy({ top: scrollAmount });
      } else if (e.key === "ArrowLeft") {
        window.scrollBy({ top: -scrollAmount });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);



    return (
        <div className="relative min-h-screen w-full bg-neutral-900 flex-col px-2 py-5">
    
            <TopBar from={from}/>

            <div className="h-full mx-auto w-full mt-[20px] overflow-y-scroll">
                <div className="h-10"></div>
                {baniVerses.length===0?<EmptyPage title={"Some technical issue"} content={"This will be fixed soon"}/> : baniVerses.map(([id, verse], index) => {

                    return (
                        <div
                        key={id}
                        className={`py-2 transition-all duration-200 text-center`}

                        >
                        {language!=="hindi" &&<div 
                            className={`font-gurmukhi  text-violet-50`}
                            style={{fontSize : `${fontSize}px` , lineHeight:"1.4"}}
                        >{verse[0]}</div>}
                        {language!=="gurmukhi" && <div 
                            className={`font-hindi text-orange-200 `}
                            style={{fontSize : `${fontSize }px`}}
                        >{verse[1]}</div>}
                        </div>
                    );
                    })}
            </div>
            <div
                className={`fixed bottom-4 right-4 z-50 group transition-opacity duration-500 opacity-50`}
            >
                <SizeControlBtns setFontSize = {setFontSize} />
            </div>
        </div>
    )

}

export default BaniView;