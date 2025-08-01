import { useEffect, useState } from "react";

function BackgroundMedia() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isSmallScreen = window.innerWidth <= 768;
      const mobileUA = /android|ipad|iphone|ipod/i.test(userAgent);
      setIsMobile(isSmallScreen || mobileUA);
    };

    checkMobile(); // run on load
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (isMobile) {
    // 📱 Mobile → Video background
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 object-cover w-full h-full -z-10 opacity-70 blur-[2px]"
      >
        <source src="/DarbarSahib.mp4" type="video/mp4" />
      </video>
    );
  }

  // 💻 Desktop → Image background
  return (
    <div
      className="fixed inset-0 bg-cover bg-center -z-10 blur-sm opacity-80"
      style={{
        backgroundImage: "url('/Darbar-sahib.jpeg')",
      }}
    ></div>
  );
}

export default BackgroundMedia;
