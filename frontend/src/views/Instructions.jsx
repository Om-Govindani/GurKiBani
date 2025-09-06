import { useState  , useEffect , useRef} from "react";
import TopBar from "../components/TopBar";

function Instructions() {
  const [os, setOs] = useState(null);
  const [step, setStep] = useState(0);
  const boxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOs(null);
        setStep(0);
      }
    }

    if (os) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [os]);

  const androidImages = [
    "/A-Step-1.png",
    "/A-Step-2.png",
    "/A-Step-3.png",
  ];

  const iosImages = [
    "/I-Step-1.jpeg",
    "/I-Step-2.jpeg",
    "/I-Step-3.jpeg",
  ];

  const images = os === "android" ? androidImages : os === "ios" ? iosImages : [];

  return (
    <div className="relative min-h-screen w-full bg-neutral-900 flex flex-col">
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {!os && (
          <div className="flex flex-col gap-6 items-center justify-center">
            <h1 className="text-3xl text-violet-200 border-b-1 border-zinc-700 py-4">Instructions for App install</h1>
            <button
              onClick={() => setOs("android")}
              className="px-6 py-3 w-80 bg-white/15 text-orange-400 text-3xl font-semibold rounded-xl shadow-md hover:bg-orange-200/15 transition"
            >
              Android
            </button>
            <button
              onClick={() => setOs("ios")}
              className="px-6 py-3 w-80 bg-white/15 text-orange-400 text-3xl font-semibold rounded-xl shadow-md hover:bg-orange-200/15 transition"
            >
              iOS
            </button>
          </div>
        )}

        {os && (
          <div ref={boxRef} className="flex flex-col items-center justify-center w-full max-w-lg">
            <div className="relative w-full flex justify-center items-center bg-neutral-800 rounded-2xl p-4 shadow-lg">
              <img
                src={images[step]}
                alt={`Step ${step + 1}`}
                className="rounded-xl h-[70vh] object-contain"
              />

              {/* Left button */}
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-3 py-2 rounded-full shadow-lg hover:bg-orange-600 transition"
                >
                  ◀
                </button>
              )}

              {/* Right button */}
              {step < images.length - 1 && (
                <button
                  onClick={() => setStep(step + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-3 py-2 rounded-full shadow-lg hover:bg-orange-600 transition"
                >
                  ▶
                </button>
              )}
            </div>

            {/* Step indicator */}
            <div className="flex mt-4 gap-2">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i === step ? "bg-orange-500" : "bg-neutral-600"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Instructions;
