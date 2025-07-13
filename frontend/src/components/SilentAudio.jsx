import { useState , useEffect , useRef} from "react";
function SilentAudio() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.loop = true;

    // Required for iOS: play after a user interaction
    const tryPlay = () => {
      audio.play().catch(() => {
        // iOS needs user interaction
        console.log("Waiting for user interaction to play silent audio.");
      });
    };

    document.addEventListener("click", tryPlay, { once: true });

    return () => {
      document.removeEventListener("click", tryPlay);
      audio.pause();
    };
  }, []);

  return <audio ref={audioRef} src="/silent.mp3" preload="auto" />;
}

export default SilentAudio;