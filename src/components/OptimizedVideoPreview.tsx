import { Lock } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

interface OptimizedVideoPreviewProps {
  src: string;
  onClick: () => void;
  likes?: string;
  comments?: string;
}

const OptimizedVideoPreview = ({
  src,
  onClick,
  likes = "89.6K",
  comments = "7.1K",
}: OptimizedVideoPreviewProps) => {
  const instanceId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const ioOptions = useMemo<IntersectionObserverInit>(
    () => ({ rootMargin: "200px", threshold: [0, 0.1] }),
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== el) continue;

        // Start loading when approaching viewport
        if (entry.intersectionRatio >= 0.1) setShouldLoad(true);

        // Play/pause based on visibility
        setIsVisible(entry.isIntersecting);
      }
    }, ioOptions);

    observer.observe(el);
    return () => observer.disconnect();
  }, [ioOptions]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    if (isVisible) {
      // Play with low priority - catches autoplay restrictions gracefully
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible, shouldLoad]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="relative aspect-[9/16] bg-card rounded-xl overflow-hidden clickable-area cursor-pointer"
    >
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          className="w-full h-full object-cover blur-[2px]"
        />
      ) : (
        <div className="w-full h-full bg-muted" />
      )}

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-background/20" />

      {/* Lock Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
          <Lock className="w-6 h-6 text-foreground/80" />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent pt-8 pb-2 px-2">
        <div className="flex items-center justify-start gap-3 text-foreground text-xs">
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

export default OptimizedVideoPreview;
