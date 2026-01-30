import VideoPreview from "./VideoPreview";
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

  const moreVideos = [
    { src: "/videos/video4.mp4", likes: "98.4K", comments: "5.3K" },
    { src: "/videos/video5.mp4", likes: "112.7K", comments: "9.8K" },
  ];

  return (
    <div className="px-3 py-4">
      {/* Videos Grid - Row 1 */}
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

      {/* Videos Grid - Row 2 */}
      <div className="grid grid-cols-3 gap-1.5 mt-1.5">
        {moreVideos.map((video, index) => (
          <VideoPreview
            key={`more-${index}`}
            src={video.src}
            likes={video.likes}
            comments={video.comments}
            onClick={onClickToSubscription}
          />
        ))}
        <div
          onClick={onClickToSubscription}
          className="relative aspect-[9/16] bg-card rounded-xl overflow-hidden clickable-area cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">+1.2K</span>
        </div>
      </div>
    </div>
  );
};

export default ContentGrid;
