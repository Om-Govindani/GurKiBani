import {useNavigate} from "react-router-dom"
import {useState , useContext, useEffect} from "react"
import TopBar from "../components/TopBar";
import LanguageContext from "../contexts/LanguageContext";
import HistoryContext from "../contexts/HistoryContext";
import SGGSContext from "../contexts/SGGSContext";
import EmptyPage from "../components/EmptyPage";

function HistoryView(){
    const navigate = useNavigate()
    const [language] = useContext(LanguageContext);
    const SGGS = useContext(SGGSContext);
    const [history , setHistory] = useContext(HistoryContext);
    const handleNavigate = (id, startId) => {
        setHistory((prev) => {
            const newEntry = { id, startId };
            const filtered = prev.filter((item) => item.id !== id);
            return [newEntry, ...filtered];
        });

        navigate(`/shabad/${startId}?highlight=${id}&from=history`);
    };

    return (
        <div className="relative min-h-screen w-full bg-neutral-900 flex-col px-2 py-5 ">
            <TopBar from={"historyView"}/>
            <div className="h-fit mx-auto max-w-3xl mt-[20px] overflow-y-scroll">
                <div className="h-10"></div>
                {
                    history.length === 0 ? <EmptyPage title={"No History Found"} content={"you haven't opened any shabad from search results yet."} /> :
                    [...history].map(({ id, startId }, idx) => {
                    const verse = SGGS[id];
                    if (!verse) return null;
                    return (
                        <div
                        key={id + idx}
                        onClick={() => handleNavigate(id, startId)}
                        className="p-4 w-full cursor-pointer transition border-b-1 border-zinc-700/40 flex flex-col"
                        >
                        {language !== "hindi" && (
                            <div className="font-gurmukhi text-xl text-violet-50">{verse[0]}</div>
                        )}
                        {language !== "gurmukhi" && (
                            <div className="font-hindi text-lg text-orange-200">{verse[1]}</div>
                        )}
                        <div className="text-xs text-neutral-400 mt-1">Ang: {id.split("-")[0]}</div>
                        </div>
                    );
                })}

            </div>
        </div>
    )
}
export default HistoryView;