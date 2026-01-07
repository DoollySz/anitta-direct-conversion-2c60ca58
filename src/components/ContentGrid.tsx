import VideoPreview from "./VideoPreview";
import bannerImage from "@/assets/banner.png";
import profileImage from "@/assets/profile-anitta.png";
import { Lock } from "lucide-react";

interface ContentGridProps {
  onClickToSubscription: () => void;
}

const ContentGrid = ({ onClickToSubscription }: ContentGridProps) => {
  const videos = [
    "/videos/video1.mp4",
    "/videos/video2.mp4",
    "/videos/video3.mp4",
  ];

  const images = [bannerImage, profileImage];

  return (
    <div className="px-4 py-4">
      {/* Videos Grid */}
      <div className="grid grid-cols-3 gap-2">
        {videos.map((video, index) => (
          <VideoPreview
            key={index}
            src={video}
            onClick={onClickToSubscription}
          />
        ))}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={onClickToSubscription}
            className="relative aspect-square bg-card rounded-xl overflow-hidden clickable-area group cursor-pointer"
          >
            <img
              src={image}
              alt={`Content ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-white/80 flex items-center gap-1">
                <Lock className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
        <div
          onClick={onClickToSubscription}
          className="relative aspect-square bg-card rounded-xl overflow-hidden clickable-area cursor-pointer flex items-center justify-center"
        >
          <div className="text-center">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <span className="text-xs text-muted-foreground">+1.2K</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGrid;
