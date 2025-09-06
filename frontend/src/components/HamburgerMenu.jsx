import { useEffect,useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import icon512 from "/icon-512.png";
import ekOnkaar from "/ekOnkaar.png";
import { FaWhatsappSquare } from "react-icons/fa";

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

  const handleShare = async () => {
    const shareData = {
      title: "Gurkibani App",
      text: `Waheguru ji ka khalsa 🙏
Waheguru ji ki fateh ✨
Link : https://gurkibani.vercel.app
Aap ji de sukraane 💛`,
      url: "https://gurkibani.vercel.app", // ya phir apk ka direct link
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // fallback: whatsapp specific share link
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `${shareData.text}\n${shareData.url}`
        )}`;
        window.open(whatsappUrl, "_blank");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

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
            <div className="flex flex-col h-19/20  items-center justify-between py-3 px-6 relative">
                <div className="fixed flex top-20 right-32">
                    <img src={ekOnkaar} alt="ekOnkaar" className="w-18 h-24" />
                </div>
                <div className="flex flex-col items-center justify-center h-full w-full gap-4 mt-10">
                    <div 
                        onClick={()=>{setIsOpen(false);navigate("/sahajpaath")}} 
                        className="text-xl text-center cursor-pointer w-full text-orange-200 border-y-1 border-zinc-700 py-4"
                    >
                        🙏 Sri Guru Granth <br/> Saheb ji
                    </div>
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
                        className="text-xl text-center cursor-pointer w-full text-orange-200 border-y-1 border-zinc-700 py-4"
                    >
                        🔍 History
                    </div>
                    
                </div>
                <div className="w-full h-1/20 flex flex-col items-center justify-center">
                    <div className="w-full flex flex-row items-center justify-center pb-6">
                        <img src={icon512} alt="App Logo" className="w-14 h-14 rounded-md" />
                        <h1 className="text-2xl ml-4 text-amber-400 font-light">Gur ki Bani</h1>
                    </div>
                    <div onClick={handleShare} className=" text-xl text-center cursor-pointer text-green-300/80 pb-6 flex flex-row items-center justify-center gap-x-2">
                        <FaWhatsappSquare size={30} /> Share on Whatsapp
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default HamburgerMenu;
