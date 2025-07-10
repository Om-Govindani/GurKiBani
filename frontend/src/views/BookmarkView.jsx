import {useNavigate} from "react-router-dom"
import {useState , useContext, useEffect} from "react"
import SGGSContext from "../contexts/SGGSContext";
import BookmarkContext from "../contexts/BookmarkContext";
import BookmarkBtn from "../components/buttons/BookmarkBtn";
import TopBar from "../components/TopBar";

function BookmarkView(){
    const navigate = useNavigate()
    const SGGS = useContext(SGGSContext);
    const [bookmarks , setBookmarks] = useContext(BookmarkContext);

    return (
        <div className="relative min-h-screen w-full bg-neutral-900 flex-col px-2 py-5 ">
    
            <TopBar />


            
            <div className="h-fit mx-auto max-w-3xl mt-[20px] overflow-y-scroll">
                <div className="h-10"></div>
                {[...bookmarks].reverse().map(({ highlightId, romanChar }, idx) => {
                const verse = SGGS[highlightId];
                if (!verse) return null;
                const handleToggle = () =>{
                    setBookmarks(prev => prev.filter(b => b.highlightId !== highlightId))
                }
                return (
                    <div key={highlightId} className={`flex flex-row`}>
                        <div
                            key={highlightId + idx}
                            onClick={() => navigate(`/shabad/${verse[5]}?highlight=${highlightId}&from=bookmarks`)}
                            className="p-4 w-full cursor-pointer transition border-b-1 border-zinc-700/40"
                        >
                            <div className="font-gurmukhi text-xl text-violet-50 pr-12">{verse[0]}</div>
                            <div className="font-hindi text-lg text-orange-200 pr-12">{verse[1]}</div>
                            <div className="text-xs text-neutral-400 mt-1">Ang: {highlightId.split("-")[0]}</div>
                        </div>
                        <div className="text-yellow-400 text-xl flex items-center pr-2 border-b-1 border-zinc-700/40">
                                <BookmarkBtn isBookmark={true} onToggle={handleToggle}/>
                        </div>
                    </div>
                );
                })}
            </div>
        </div>
    )

}

export default BookmarkView;