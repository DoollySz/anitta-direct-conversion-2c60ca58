import { Lock } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

interface OptimizedVideoPreviewProps {
  src: string;
  onClick: () => void;
  likes?: string;
  comments?: string;
}

// Keep only one video playing at a time to avoid CPU/GPU spikes on mobile.
let activeVideoEl: HTMLVideoElement | null = null;

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
  const [isActive, setIsActive] = useState(false);

  const ioOptions = useMemo<IntersectionObserverInit>(
    () => ({ rootMargin: "120px", threshold: [0, 0.35, 0.6, 0.85] }),
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== el) continue;

        // Start loading slightly before it appears.
        if (entry.intersectionRatio >= 0.35) setShouldLoad(true);

        // Only consider "active" when largely visible.
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.6);
      }
    }, ioOptions);

    observer.observe(el);
    return () => observer.disconnect();
  }, [ioOptions]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const pauseAndRewind = () => {
      try {
        video.pause();
        // Rewinding every time can cause extra work; keep it simple.
        video.currentTime = 0;
      } catch {
        // no-op
      }
    };

    if (!shouldLoad) {
      pauseAndRewind();
      if (activeVideoEl === video) activeVideoEl = null;
      return;
    }

    if (isActive) {
      if (activeVideoEl && activeVideoEl !== video) {
        try {
          activeVideoEl.pause();
        } catch {
          // no-op
        }
      }

      activeVideoEl = video;
      video
        .play()
        .catch(() => {
          // Autoplay can be blocked; keep it muted anyway.
        });
    } else {
      if (activeVideoEl === video) activeVideoEl = null;
      pauseAndRewind();
    }

    return () => {
      if (activeVideoEl === video) activeVideoEl = null;
      pauseAndRewind();
    };
  }, [isActive, shouldLoad, instanceId]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="relative aspect-[9/16] bg-card rounded-xl overflow-hidden clickable-area cursor-pointer"
    >
      {/*
        Important performance choices:
        - render the <video> only when near viewport (shouldLoad)
        - avoid CSS blur filter on video (expensive on mobile)
        - allow only 1 video playing globally
      */}
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          className="w-full h-full object-cover"
        />
      ) : (
        // Lightweight placeholder that keeps layout stable.
        <div className="w-full h-full bg-muted" />
      )}

      {/* Soft overlay to communicate gated content without heavy filters */}
      <div className="absolute inset-0 bg-background/10" />

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
