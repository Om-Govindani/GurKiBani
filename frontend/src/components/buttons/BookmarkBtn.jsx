function BookmarkBtn({ isBookmark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle bookmark"
      className="w-7 h-8 p-1 rounded-md transition hover:scale-105 active:scale-95"
    >
      <svg
        viewBox="0 0 32 32"
        fill={isBookmark ? "#FFD700" : "#616161"} // Golden if bookmarked
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"/>
      </svg>
    </button>
  );
}

export default BookmarkBtn;
