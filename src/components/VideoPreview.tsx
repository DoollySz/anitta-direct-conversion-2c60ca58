import { Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoPreviewProps {
  src: string;
  onClick: () => void;
  likes?: string;
  comments?: string;
}

const VideoPreview = ({ src, onClick, likes = "89.6K", comments = "7.1K" }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's ok
      });
    }
  }, [isVisible, isLoaded]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="relative aspect-[9/16] bg-card rounded-xl overflow-hidden clickable-area cursor-pointer"
    >
      {/* Skeleton loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-card animate-pulse" />
      )}
      
      {isVisible && (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover blur-sm transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      
      {/* Lock Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Lock className="w-6 h-6 text-white/80" />
        </div>
      </div>
      
      {/* Bottom Stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-2 px-2">
        <div className="flex items-center justify-start gap-3 text-white text-xs">
          <span className="flex items-center gap-1">
            <span>♡</span>
            <span>{likes}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>💬</span>
            <span>{comments}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
