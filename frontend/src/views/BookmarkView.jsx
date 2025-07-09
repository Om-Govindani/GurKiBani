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
    
    useEffect(()=>{
        console.log(bookmarks)
    },[bookmarks])

    return (
        <div className="relative h-screen w-full bg-neutral-900 flex-col px-2 py-5 overflow-y-scroll">
    
            <div
                className="fixed top-0 left-0 w-full z-50 px-6 flex items-center min-h-[72px] bg-black/5"
                style={{
                    paddingTop: `calc(env(safe-area-inset-top) + 12px)`,
                    paddingBottom: '0.5rem',
                    backdropFilter: 'blur(8px)',
                    // backgroundColor: 'rgba(15,15,15,0.6)',
                }}
                >
                <div className="w-full mx-auto h-fit flex items-center justify-between">
                    {/* Back Button (top left) */}
                    <button
                    onClick={() => navigate("/")}
                    className="flex items-center text-white transition text-xl"
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

                    {/* Page Title (centered visually) */}
                    <div className="text-white text-xl font-light text-center mr-12">
                    Bookmarks
                    </div>
                </div>
                </div>


            
            <div className="h-full mx-auto max-w-3xl mt-[20px]">
                <div className="h-10"></div>
                {[...bookmarks].reverse().map(({ highlightId, romanChar }, idx) => {
                const verse = SGGS[highlightId];
                if (!verse) return null;
                const handleToggle = () =>{
                    setBookmarks(prev => prev.filter(b => b.highlightId !== highlightId))
                }
                return (
                    <div key={highlightId} className={`flex flex-row bg-zinc-800 hover:bg-zinc-700 ${idx === 0 ? "rounded-t-2xl" : idx === bookmarks.length-1 ? "rounded-b-2xl": "" }`}>
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