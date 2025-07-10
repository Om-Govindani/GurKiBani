import {useState , useContext, useEffect} from "react"
import {useParams ,useSearchParams} from "react-router-dom"
import TopBar from "../components/TopBar";
import SundarGutka from "../../public/SundarGutka.json"
import SizeControlBtns from "../components/buttons/SizeControlBtns";

function BaniView(){
    const { name } = useParams(); 
    const decodedName = decodeURIComponent(name); 
    const baniVerses = Object.entries(SundarGutka[decodedName]) || {};
    const [fontSize , setFontSize] = useState(24);
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <div className="relative min-h-screen w-full bg-neutral-900 flex-col px-2 py-5">
    
            <TopBar from={"bani"}/>

            <div className="h-full mx-auto max-w-3xl mt-[20px] overflow-y-scroll">
                <div className="h-10"></div>
                {baniVerses.map(([id, verse], index) => {

                    return (
                        <div
                        key={id}
                        className={`py-4 transition-all duration-200 text-center`}

                        >
                        <div 
                            className={`font-gurmukhi  text-violet-50`}
                            style={{fontSize : `${fontSize}px` , lineHeight:"1.4"}}
                        >{verse[0]}</div>
                        <div 
                            className={`font-hindi text-orange-200 `}
                            style={{fontSize : `${fontSize }px`}}
                        >{verse[1]}</div>
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