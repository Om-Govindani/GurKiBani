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

  useEffect(() => {
    let initialDistance = null;

    function getDistance(touches) {
        const [a, b] = touches;
        const dx = a.clientX - b.clientX;
        const dy = a.clientY - b.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchMove(e) {
        if (e.touches.length === 2) {
        const distance = getDistance(e.touches);
        if (initialDistance === null) {
            initialDistance = distance;
        } else {
            const delta = distance - initialDistance;
            if (Math.abs(delta) > 10) {
            if (delta > 0) {
                setFontSize((f) => Math.min(f + 1, 48));
            } else {
                setFontSize((f) => Math.max(f - 1, 12));
            }
            initialDistance = distance;
            }
        }
        }
    }

    function resetDistance() {
        initialDistance = null;
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", resetDistance);
    document.addEventListener("touchcancel", resetDistance);

    return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", resetDistance);
        document.removeEventListener("touchcancel", resetDistance);
    };
    }, []);


    const highlightVerses = [
        "ੴ सति नामु करता पुरखु निरभउ निरवैरु",
        "अकाल मूरति अजूनी सैभं गुर प्रसादि ॥",
        "॥ जपु ॥",
        "सलोकु ॥",
        "शबद हजारे",
        "माझ महला ५ चउपदे घरु १ ॥",
        "धनासरी महला १ घरु १ चउपदे",
        "तिलंग महला १ घरु ३",
        "ੴ सतिगुर प्रसादि ॥",
        "तिलंग मः १ ॥",
        "सूही महला १ ॥",
        "रागु बिलावलु महला १ चउपदे घरु १ ॥",
        "बिलावलु महला १ ॥",
        "जापु साहिब",
        "स्री वाहिगुरू जी की फतह ॥",
        "जापु",
        "स्री मुखवाक पातिसाही  १० ॥",
        "छपै छंद ॥ त्व प्रसादि ॥",
        "भुजंग प्रयात छंद ॥",
        "चाचरी छंद ॥ त्व प्रसादि ॥",
        "भुजंग प्रयात छंद ॥",
        "तेरा जोरु ॥ चाचरी छंद ॥",
        "चरपट छंद ॥ त्व प्रसादि ॥",
        "मधुभार छंद ॥ त्व प्रसादि ॥",
        "चाचरी छंद ॥",
        "भगवती छंद ॥ त्व परस्रादि कथते ॥",
        "रसावल छंद ॥ त्व प्रसादि ॥",
        "भगवती छंद ॥ त्व प्रसादि ॥",
        "हरिबोलमना छंद ॥ त्व प्रसादि ॥",
        "एक अछरी छंद ॥",
        "ੴ वाहिगुरू जी की फतह॥",
        "पातिशाही १०॥",
        "त्व प्रसादि सवये",
        "त्व प्रसादि ॥ चौपई ॥",
        "अनंदु साहिब",
        "रामकली महला ३ अनंदु",
        "सोहिला रागु गउड़ी दीपकी महला १",
        "रागु आसा महला १ ॥",
        "रागु धनासरी महला १ ॥",
        "रागु गउड़ी पूरबी महला ४ ॥",
        "रागु गउड़ी पूरबी महला ५ ॥",
        "सलोकु मः १ ॥",
        "सो दरु रागु आसा महला १",
        "आसा महला १ ॥",
        "रागु गूजरी महला ४ ॥",
        "रागु गूजरी महला ५ ॥",
        "रागु आसा महला ४ सो पुरखु",
        "आसा महला ४ ॥",
        "आसा महला ५ ॥",
        "कबयो बाच बेनती ॥",
        "चौपई ॥",
        "स्वैया ॥",
        "दोहरा ॥",
        "मुंदावणी महला ५ ॥",
        "सलोक महला ५ ॥",
        "पउड़ी ॥",
        "रागु गूजरी वार महला ५",
        "सलोकु मः ५ ॥",
        "मः ५ ॥",
        "पाः १० कबियोबाच बेनती ॥  चौपई ॥",
        "अड़िल ॥",
        "ੴ वाहिगुरू जी की फतहि ॥",
        "वाहिगुरू जी का खालसा ॥",
        "वाहिगुरू जी की फ़तहि ॥",
        "गउड़ी सुखमनी मः ५ ॥",
        "सलोकु ॥",
        "असटपदी ॥",
        "सलोक महला ९ ॥",
        "धनासरी महला १ आरती",
        "स्री सैणु ॥",
        "प्रभाती ॥",
        "धंना ॥",
        "स्वैया ॥",
        "सवैया ॥",
        "गउड़ी महला ५ ॥",
        "गउड़ी महला ५ मांझ ॥",
        "बिलावलु महला ५ ॥",
        "रागु बिलावलु महला ५ दुपदे घरु ५",
        "सोरठि महला ५ ॥",
        "सोरठि मः ५ ॥"
    ]

    return (
        <div className="relative min-h-screen w-full bg-neutral-900 flex-col px-2 py-5">
    
            <TopBar from={from}/>

            <div className="h-full mx-auto w-full mt-[20px] overflow-y-scroll">
                <div className="h-10"></div>
                {baniVerses.length === 0 ? (
                    <EmptyPage title={"Some technical issue"} content={"This will be fixed soon"} />
                    ) : (
                    baniVerses.map(([id, verse], index) => {
                        const isHighlighted = highlightVerses.includes(verse[1]);

                        return (
                        <div
                            key={id}
                            className={`py-2 transition-all duration-200 text-center`}
                        >
                            {language !== "hindi" && (
                            <div
                                className={`font-gurmukhi ${isHighlighted ? "text-rose-300" : "text-violet-50"}`}
                                style={{ fontSize: `${fontSize}px`, lineHeight: "1.4" }}
                            >
                                {verse[0]}
                            </div>
                            )}
                            {language !== "gurmukhi" && (
                            <div
                                className={`font-hindi ${isHighlighted ? "text-orange-400" : "text-orange-200"}`}
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                {verse[1]}
                            </div>
                            )}
                        </div>
                        );
                    })
                    )}

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