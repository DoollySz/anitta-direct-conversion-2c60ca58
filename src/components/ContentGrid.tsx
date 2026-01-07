import VideoPreview from "./VideoPreview";
import bannerImage from "@/assets/banner.png";
import profileImage from "@/assets/profile-anitta.png";
import { Lock } from "lucide-react";

interface ContentGridProps {
  onClickToSubscription: () => void;
}

const ContentGrid = ({ onClickToSubscription }: ContentGridProps) => {
  const videos = [
    { src: "/videos/video1.mp4", likes: "125.3K", comments: "8.2K" },
    { src: "/videos/video2.mp4", likes: "89.6K", comments: "7.1K" },
    { src: "/videos/video3.mp4", likes: "156.8K", comments: "12.4K" },
  ];

  const images = [bannerImage, profileImage];

  return (
    <div className="px-3 py-4">
      {/* Videos Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {videos.map((video, index) => (
          <VideoPreview
            key={index}
            src={video.src}
            likes={video.likes}
            comments={video.comments}
            onClick={onClickToSubscription}
          />
        ))}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-3 gap-1.5 mt-1.5">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={onClickToSubscription}
            className="relative aspect-square bg-card rounded-xl overflow-hidden clickable-area cursor-pointer"
          >
            <img
              src={image}
              alt={`Content ${index + 1}`}
              className="w-full h-full object-cover blur-sm"
            />
            
            {/* Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Lock className="w-4 h-4 text-white/80" />
              </div>
            </div>
            
            {/* Subscribe Text */}
            <div className="absolute bottom-2 left-0 right-0">
              <p className="text-center text-[10px] text-primary font-medium">
                Assine pra ver
              </p>
            </div>
          </div>
        ))}
        <div
          onClick={onClickToSubscription}
          className="relative aspect-square bg-card rounded-xl overflow-hidden clickable-area cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">+1.2K</span>
          <p className="text-[10px] text-primary font-medium mt-1">
            Assine pra ver
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentGrid;
