import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import icon512 from "/icon-512.png"
import ekOnkaar from "/ekOnkaar.png"

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        <div className="fixed top-4 left-4 z-[999]">
            <button
                className={`${isOpen ? "text-white" : "md:text-zinc-800 text-white"} p-2 cursor-pointer rounded-md transition`}
                onClick={()=>setIsOpen(!isOpen)}
            >
                {isOpen ? <HiX size={30}/> : <HiMenu size={30} />}
            </button>
        </div>
        <div className={`fixed top-0 left-0 h-screen w-80 bg-zinc-800 shadow-lg z-[998] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex flex-col h-9/10 justify-between py-3 px-6 relative">
                <div className="fixed flex top-20 right-32">
                    <img src={ekOnkaar} alt="ekOnkaar" className="w-18 h-24" />
                </div>
                <div className="flex flex-col items-center justify-center h-full w-full gap-4 mt-10">
                    <div href="/nitnem" className="text-xl text-center w-full text-orange-200 border-b-1 border-zinc-700 pb-4 ">📿 Sundar Gutka</div>
                    <div href="/bookmarks" className="text-xl text-center w-full text-orange-200 ">📖 Bookmarks</div>
                    <div href="/history" className="text-xl text-center w-full text-orange-200 border-t-1 border-zinc-700 pt-4">🔍 History</div>
                    <div href="/about" className="text-xl text-center w-full text-orange-200 border-t-1 border-zinc-700 pt-4">🙏 About</div>
                </div>
                <div className="w-full h-1/10 flex flex-col items-center justify-center mb-4">
                    <h1 className="text-3xl mb-4 text-amber-400 font-medium">गुर की बानी</h1>
                    <img src={icon512} alt="App Logo" className="w-44 h-44" />
                </div>
            </div>
        </div>
    </>
  );
}

export default HamburgerMenu;
