import {useNavigate} from "react-router-dom"
import {useState , useContext, useEffect} from "react"
import SGGSContext from "../contexts/SGGSContext";
import BookmarkContext from "../contexts/BookmarkContext";
import BookmarkBtn from "../components/buttons/BookmarkBtn";

function BookmarkView(){
    const navigate = useNavigate()
    const SGGS = useContext(SGGSContext);
    const [bookmarks , setBookmarks] = useContext(BookmarkContext);
    
    useEffect(()=>{
        console.log(bookmarks)
    },[bookmarks])

    return (
        <div className="h-screen w-full bg-neutral-900 px-2 py-5 flex-col">
            <div className="w-full mx-auto h-fit flex items-center justify-between">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center text-white transition text-xl cursor-pointer"
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
            </div>
            
            <div className=" mx-auto overflow-y-scroll mt-4 max-w-3xl rounded-2xl">
                {[...bookmarks].reverse().map(({ highlightId, romanChar }, idx) => {
                const verse = SGGS[highlightId];
                if (!verse) return null;
                const handleToggle = () =>{
                    setBookmarks(prev => prev.filter(b => b.highlightId !== highlightId))
                }
                return (
                    <div key={highlightId} className="flex flex-row bg-zinc-800 hover:bg-zinc-700">
                        <div
                            key={highlightId + idx}
                            onClick={() => navigate(`/shabad/${verse[5]}?highlight=${highlightId}`)}
                            className="p-4 w-full cursor-pointer transition border-b-1 border-zinc-900/40"
                        >
                            <div className="font-gurmukhi text-xl text-violet-50 pr-12">{verse[0]}</div>
                            <div className="font-hindi text-lg text-orange-200 pr-12">{verse[1]}</div>
                            <div className="text-xs text-neutral-400 mt-1">Ang: {highlightId.split("-")[0]}</div>
                        </div>
                        <div className="text-yellow-400 text-xl flex items-center pr-2 border-b-1 border-zinc-900/40">
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