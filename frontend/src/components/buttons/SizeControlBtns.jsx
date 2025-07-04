function SizeControlBtns({setFontSize}){
    return (
        <div className="flex items-center bg-zinc-600/80 backdrop-blur-sm shadow-lg border border-zinc-600 rounded-full overflow-hidden group-hover:opacity-100">
          <button
            onClick={() => setFontSize((s) => Math.min(s + 2, 48))}
            className="text-white px-4 py-2 text-xl hover:bg-zinc-600 transition"
          >
            +
          </button>
          <div className="w-px h-6 bg-zinc-500" />
          <button
            onClick={() => setFontSize((s) => Math.max(s - 2, 14))}
            className="text-white px-4 py-2 text-xl hover:bg-zinc-600 transition"
          >
            −
          </button>
        </div>
    )
}
export default SizeControlBtns