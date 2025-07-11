import { useEffect,useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import icon512 from "/icon-512.png"
import ekOnkaar from "/ekOnkaar.png"

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(()=>{
    function handleClickOutside(e){
        if(menuRef.current && !menuRef.current.contains(e.target)){
            setIsOpen(false);
        }
    }
    if(isOpen){
        document.addEventListener("mousedown" , handleClickOutside);
        // document.addEventListener("touchstart" , handleClickOutside)
    }else{
        document.removeEventListener("mousedown" , handleClickOutside);
        // document.removeEventListener("touchstart" , handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    //   document.removeEventListener("touchstart", handleClickOutside);
    };
  },[isOpen])

  return (
    <>
        <div className="fixed md:top-4 md:left-4 top-1 left-1 z-[999]"
            style={{
                paddingTop: `calc(env(safe-area-inset-top) + 12px)`,
                paddingBottom: '0.5rem',
                transform: 'translateZ(0)'
            }}
        >
            <button
                className={`${isOpen ? "text-white" : "md:text-zinc-800 text-white"} p-2 cursor-pointer rounded-md transition`}
                onClick={()=>setIsOpen(!isOpen)}
            >
                {isOpen ? <HiX size={30}/> : <HiMenu size={30} />}
            </button>
        </div>
        <div 
            className={`fixed top-0 left-0 h-screen w-80 bg-zinc-800 backdrop-blur-2xl shadow-lg z-[998] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            ref={menuRef}
        >
            <div className="flex flex-col h-19/20 justify-between py-3 px-6 relative">
                <div className="fixed flex top-20 right-32">
                    <img src={ekOnkaar} alt="ekOnkaar" className="w-18 h-24" />
                </div>
                <div className="flex flex-col items-center justify-center h-full w-full gap-4 mt-10">
                    <div 
                        onClick={()=>{setIsOpen(false);navigate("/nitnem")}} 
                        className="text-xl text-center cursor-pointer w-full text-orange-200 border-b-1 border-zinc-700 pb-4"
                    >
                        📿 Sundar Gutka
                    </div>
                    <div 
                        onClick={()=>{setIsOpen(false);navigate("/bookmarks")}} 
                        className="text-xl text-center cursor-pointer w-full text-orange-200"
                    >
                        📖 Bookmarks
                    </div>
                    <div 
                        onClick={()=>{setIsOpen(false);navigate("/history")}} 
                        className="text-xl text-center cursor-pointer w-full text-orange-200 border-t-1 border-zinc-700 pt-4"
                    >
                        🔍 History
                    </div>
                    {/* <div 
                        onClick={()=>{setIsOpen(false);navigate("/aboutus")}} 
                        className="text-xl text-center cursor-pointer w-full text-orange-200 border-t-1 border-zinc-700 pt-4"
                    >
                        🙏 About us
                    </div> */}
                </div>
                <div className="w-full h-1/20 flex flex-row items-center justify-center">
                    <img src={icon512} alt="App Logo" className="w-14 h-14 rounded-md" />
                    <h1 className="text-2xl ml-4 text-amber-400 font-light">Gur ki Bani</h1>
                </div>
            </div>
        </div>
    </>
  );
}

export default HamburgerMenu;
