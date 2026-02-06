import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";

interface ParadisePlayerProps {
  src: string;
}

const ParadisePlayer = ({ src }: ParadisePlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [showMuteOverlay, setShowMuteOverlay] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start muted autoplay
    video.muted = true;
    video.play().catch(() => {});

    // Progress bar update
    const handleTimeUpdate = () => {
      if (!video.duration || !progressRef.current) return;
      
      const realProgress = video.currentTime / video.duration;
      const phase1Threshold = 0.15;
      const targetProgress = 0.5;
      
      let fakeProgressValue;
      if (realProgress <= phase1Threshold) {
        fakeProgressValue = (realProgress / phase1Threshold) * targetProgress;
      } else {
        const remainingRealProgress = (realProgress - phase1Threshold) / (1 - phase1Threshold);
        const remainingFakeProgress = (1 - targetProgress) * remainingRealProgress;
        fakeProgressValue = targetProgress + remainingFakeProgress;
      }
      
      progressRef.current.style.width = `${Math.min(fakeProgressValue, 1) * 100}%`;
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.currentTime = 0;
    video.play();
    setShowMuteOverlay(false);
  };

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video || showMuteOverlay) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Video Wrapper - 9:16 aspect ratio */}
      <div 
        className="relative w-full bg-black rounded-xl overflow-hidden"
        style={{ 
          paddingBottom: "177.78%",
          boxShadow: "0 0 20px rgba(255, 102, 0, 0.3), 0 0 5px rgba(255, 102, 0, 0.5)"
        }}
      >
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
          playsInline
          preload="auto"
          onClick={handleVideoClick}
          onContextMenu={(e) => e.preventDefault()}
        >
          <source src={src} type="video/mp4" />
          Seu navegador não suporta vídeos HTML5.
        </video>

        {/* Mute Overlay */}
        {showMuteOverlay && (
          <div
            onClick={handleUnmute}
            className="absolute inset-0 flex justify-center items-center bg-black/50 cursor-pointer z-20 backdrop-blur-sm transition-opacity duration-300"
          >
            <div 
              className="bg-primary px-6 py-5 sm:px-10 sm:py-7 rounded-xl text-center text-white animate-pulse"
              style={{ 
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                maxWidth: "90vw"
              }}
            >
              <div className="text-sm sm:text-base font-bold mb-2">
                Seu vídeo já começou!
              </div>
              <div className="mb-3 flex justify-center">
                <Volume2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div className="text-xs sm:text-sm font-medium opacity-95">
                Clique para ativar o som
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div 
          className="absolute bottom-1 left-2 right-2 h-1 bg-white/20 rounded-full z-20 pointer-events-none"
          style={{ transition: "bottom 0.3s ease" }}
        >
          <div
            ref={progressRef}
            className="h-full rounded-full"
            style={{ 
              background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
              width: "0%",
              boxShadow: "0 0 8px rgba(255, 102, 0, 0.5)"
            }}
          />
        </div>
      </div>

      {/* Hide native controls */}
      <style>{`
        video::-webkit-media-controls,
        video::-webkit-media-controls-enclosure {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default ParadisePlayer;
