// src/components/buttons/AutoScrollDial.jsx
import React, { useRef } from "react";

export default function AutoScrollDial({ speed, setSpeed }) {
  const startX = useRef(null);
  const dragging = useRef(false);

  const inc = () => setSpeed((s) => (s === 10 ? 1 : s + 1));
  const dec = () => setSpeed((s) => (s === 1 ? 10 : s - 1));

  // pointer helpers (works with mouse and touch)
  const handlePointerStart = (clientX) => {
    startX.current = clientX;
    dragging.current = true;
  };

  const handlePointerMove = (clientX) => {
    if (!dragging.current || startX.current === null) return;
    const diff = clientX - startX.current;
    const THRESH = 15; // pixel threshold to change one step
    if (Math.abs(diff) > THRESH) {
      if (diff < 0) {
        // swipe left -> increase (like wheel)
        inc();
      } else {
        // swipe right -> decrease
        dec();
      }
      startX.current = clientX; // allow continuous changes while holding
    }
  };

  const handlePointerEnd = () => {
    dragging.current = false;
    startX.current = null;
  };

  // touch handlers
  const onTouchStart = (e) => handlePointerStart(e.touches[0].clientX);
  const onTouchMove = (e) => {
    handlePointerMove(e.touches[0].clientX);
  };
  const onTouchEnd = () => handlePointerEnd();

  // mouse handlers (attach global move/up while dragging)
  const onMouseDown = (e) => {
    handlePointerStart(e.clientX);
    const onMove = (ev) => handlePointerMove(ev.clientX);
    const onUp = () => {
      handlePointerEnd();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // compute prev/current/next for display (infinite wrap)
  const prev = speed === 1 ? 10 : speed - 1;
  const next = speed === 10 ? 1 : speed + 1;

  return (
    <div className="w-[96px] flex items-center justify-center select-none bg-zinc-600 backdrop-blur-sm shadow-lg border border-zinc-600 rounded-full">
      <div
        role="slider"
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={speed}
        className="flex items-center "
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        style={{ touchAction: "pan-y" }} // allow horizontal handling without vertical interference
      >
        <div className="w-[20px] text-center transition-all duration-200 text-lg text-gray-400 opacity-70">
          {prev}
        </div>

        <div className="w-[36px] text-center transition-all duration-200 text-3xl font-bold text-white">
          {speed}
        </div>

        <div className="w-[20px] text-center transition-all duration-200 text-lg text-gray-400 opacity-70">
          {next}
        </div>
      </div>
    </div>
  );
}
