import { Lock } from "lucide-react";

interface VideoPreviewProps {
  src: string;
  onClick: () => void;
}

const VideoPreview = ({ src, onClick }: VideoPreviewProps) => {
  return (
    <div
      onClick={onClick}
      className="relative aspect-[9/16] bg-card rounded-xl overflow-hidden clickable-area group cursor-pointer"
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs text-white/80 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Conteúdo exclusivo
        </span>
      </div>
    </div>
  );
};

export default VideoPreview;
