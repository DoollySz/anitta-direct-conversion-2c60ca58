import { Lock } from "lucide-react";

interface VideoPreviewProps {
  src: string;
  onClick: () => void;
  likes?: string;
  comments?: string;
}

const VideoPreview = ({ src, onClick, likes = "89.6K", comments = "7.1K" }: VideoPreviewProps) => {
  return (
    <div
      onClick={onClick}
      className="relative aspect-[9/16] bg-card rounded-xl overflow-hidden clickable-area cursor-pointer"
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover blur-sm"
      />
      
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
      
      {/* Subscribe Text */}
      <div className="absolute bottom-0 left-0 right-0 pb-1">
        <p className="text-center text-[10px] text-primary font-medium">
          Assine pra ver
        </p>
      </div>
    </div>
  );
};

export default VideoPreview;
