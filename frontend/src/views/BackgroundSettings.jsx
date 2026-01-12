import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function BackgroundSettings() {
  const [preview, setPreview] = useState("");
  const [blur, setBlur] = useState(4);       // px
  const [opacity, setOpacity] = useState(0.8); // 0 to 1

  const fileRef = useRef(null);
  const navigate = useNavigate();

  // apply vars helper
  const applyVars = ({ bg, blurVal, opacityVal }) => {
    if (bg) {
      document.documentElement.style.setProperty("--gkb-bg-desktop", `url(${bg})`);
      document.documentElement.style.setProperty("--gkb-bg-mobile", `url(${bg})`);
    }
    if (typeof blurVal === "number") {
      document.documentElement.style.setProperty("--gkb-bg-blur", `${blurVal}px`);
    }
    if (typeof opacityVal === "number") {
      document.documentElement.style.setProperty("--gkb-bg-opacity", `${opacityVal}`);
    }
  };

  useEffect(() => {
    // ✅ Desktop block
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) {
      alert("This feature is only available on mobile.");
      navigate("/", { replace: true });
      return;
    }

    // ✅ Load saved background
    const savedBg = localStorage.getItem("gkb_bg");
    if (savedBg) setPreview(savedBg);

    // ✅ Load saved blur/opacity
    const savedBlur = localStorage.getItem("gkb_bg_blur");
    const savedOpacity = localStorage.getItem("gkb_bg_opacity");

    const blurVal = savedBlur ? Number(savedBlur) : 4;
    const opacityVal = savedOpacity ? Number(savedOpacity) : 0.8;

    setBlur(blurVal);
    setOpacity(opacityVal);

    // ✅ Apply them immediately
    applyVars({
      bg: savedBg || null,
      blurVal,
      opacityVal,
    });
  }, [navigate]);

  // whenever blur changes
  useEffect(() => {
    applyVars({ blurVal: blur });
    localStorage.setItem("gkb_bg_blur", String(blur));
  }, [blur]);

  // whenever opacity changes
  useEffect(() => {
    applyVars({ opacityVal: opacity });
    localStorage.setItem("gkb_bg_opacity", String(opacity));
  }, [opacity]);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);

      localStorage.setItem("gkb_bg", dataUrl);
      applyVars({ bg: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    localStorage.removeItem("gkb_bg");
    localStorage.removeItem("gkb_bg_blur");
    localStorage.removeItem("gkb_bg_opacity");

    document.documentElement.style.removeProperty("--gkb-bg-desktop");
    document.documentElement.style.removeProperty("--gkb-bg-mobile");
    document.documentElement.style.removeProperty("--gkb-bg-blur");
    document.documentElement.style.removeProperty("--gkb-bg-opacity");

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-lg bg-zinc-900/60 border border-zinc-700 rounded-2xl p-5 backdrop-blur-md">
        <h1 className="text-xl font-semibold mb-4">Background Settings</h1>

        {/* ✅ hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {/* ✅ Button */}
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition font-medium"
        >
          Choose Wallpaper
        </button>

        {/* Preview */}
        {preview && (
            <div className="mt-4">
                <div className="text-sm text-white/70 mb-2">Preview :</div>

                <div className="w-full rounded-2xl border border-zinc-700 overflow-hidden">
                <img
                    src={preview}
                    alt="preview"
                    className="w-full scale-110"
                    style={{
                    filter: `blur(${blur}px)`,
                    opacity: opacity,
                    }}
                />
                </div>
            </div>
        )}


        {/* ✅ Blur slider */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/80">Blur</span>
            <span className="text-sm text-white/60">{blur}px</span>
          </div>

          <input
            type="range"
            min={0}
            max={20}
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* ✅ Opacity slider */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/80">Opacity</span>
            <span className="text-sm text-white/60">{Math.round(opacity * 100)}%</span>
          </div>

          <input
            type="range"
            min={0.2}
            max={1}
            step={0.01}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => navigate("/", { replace: true })}
            className="flex-1 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition"
          >
            Done
          </button>
          <button
            onClick={reset}
            className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default BackgroundSettings;
