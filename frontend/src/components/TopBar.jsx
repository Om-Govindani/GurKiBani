import {useNavigate} from "react-router-dom"
import BookmarkBtn from "./buttons/BookmarkBtn";
import {useContext , useState , useEffect} from "react"
import BookmarkContext from "../contexts/BookmarkContext"
import SGGSContext from "../contexts/SGGSContext";


function TopBar({highlightId}){
    const navigate = useNavigate()
    
    const [bookmarks , setBookmarks] = useContext(BookmarkContext);
    const SGGS = useContext(SGGSContext);
    const found = bookmarks.some((b) => b.highlightId === highlightId);
    const [isBookmark , setIsBookmark] = useState(found);
    const tmpBookmarks = []
    function convertToGurmukhiNumber(num) {
        const gurmukhiDigits = ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'];
        return num
            .split('')
            .map(digit => gurmukhiDigits[parseInt(digit, 10)])
            .join('');
    }

    useEffect(() => {
        setIsBookmark(found)
    }, [highlightId, bookmarks])

    const handleBookmarkToggle = () => {
        if (!SGGS[highlightId]) return;
    
        const newState = !isBookmark
        setIsBookmark(newState)

        setBookmarks(prev => {
            if (newState) {
                if (!prev.some(b => b.highlightId === highlightId)) {
                return [...prev, {
                    highlightId,
                    romanChar: SGGS[highlightId][4]
                }]
                }
            } else {
                // Remove if exists
                return prev.filter(b => b.highlightId !== highlightId)
            }
            return prev
        })
    }

  
  useEffect(() => {
    setBookmarks((prev) => {
      const alreadyBookmarked = prev.some((b) => b.highlightId === highlightId);

      if (isBookmark && !alreadyBookmarked) {
        return [...prev, { highlightId, romanChar: SGGS[highlightId][4] }];
      } else if (!isBookmark && alreadyBookmarked) {
        return prev.filter((b) => b.highlightId !== highlightId);
      }
      return prev;
    });
    console.log(bookmarks)
  }, [isBookmark, highlightId, SGGS]);

    
    return (
        <div
        className="fixed top-0 left-0 w-full z-50 px-2 flex items-center h-[72px] bg-black/5"
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + 12px)`,
          paddingBottom: '0.5rem', // or your preferred padding
        //   backgroundColor: 'rgba(15, 15, 15, 0.6)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div className="w-full mx-auto h-fit flex items-center justify-between ">
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

          {/* Gurmukhi Ang Number (top right) */}
          <div className="flex flex-row space-x-4">
            <div className="text-xl text-white font-gurmukhi">
                ਅੰਗ: {convertToGurmukhiNumber(highlightId.split("-")[0])}
            </div>
            <BookmarkBtn isBookmark = {isBookmark} onToggle={handleBookmarkToggle} />
          </div>
        </div>
      </div>
    )
}
export default TopBar;