// src/components/buttons/AutoScroll.jsx
import React, { useEffect, useRef, useState } from "react";
import AutoScrollDial from "./AutoScrollDial";
import { Play, Square } from "lucide-react";

export default function AutoScroll({ containerRef }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3); // default 3
  const directionRef = useRef("down"); // 'down' or 'up'

  // Scroll loop: use setInterval and change scrollTop directly
  useEffect(() => {
    if (!isPlaying) return;

    const container = containerRef?.current || document.scrollingElement;
    if (!container) return;

    const pxPerTick = Math.max(1, Math.round(speed)); // pixels per interval tick
    const intervalMs = 40; // tick every 80ms (feel free to tune)

    const id = setInterval(() => {
      if (directionRef.current === "down") {
        container.scrollTop = Math.min(container.scrollHeight, container.scrollTop + pxPerTick);
      } else {
        container.scrollTop = Math.max(0, container.scrollTop - pxPerTick);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [isPlaying, speed, containerRef]);

  // detect manual scroll to change direction
  useEffect(() => {
    const el = containerRef?.current || document.scrollingElement;
    if (!el) return;

    let last = el.scrollTop;
    const onScroll = () => {
      const cur = el.scrollTop;
      if (cur > last) directionRef.current = "down";
      else if (cur < last) directionRef.current = "up";
      last = cur;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-center gap-3">
      <AutoScrollDial speed={speed} setSpeed={setSpeed} />

      <button
        onClick={() => setIsPlaying((p) => !p)}
        className="w-12 h-12 rounded-full bg-zinc-600 text-white flex items-center justify-center shadow-lg"
        aria-pressed={isPlaying}
      >
        {isPlaying ? <Square size={20} /> : <Play size={20} />}
      </button>
    </div>
  );
}
