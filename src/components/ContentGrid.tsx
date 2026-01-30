import VideoPreview from "./VideoPreview";
import { Lock, Images } from "lucide-react";

interface ContentGridProps {
  onClickToSubscription: () => void;
}

const ContentGrid = ({ onClickToSubscription }: ContentGridProps) => {
  const videosRow1 = [
    { src: "/videos/video1.mp4", likes: "125.3K", comments: "8.2K" },
    { src: "/videos/video2.mp4", likes: "89.6K", comments: "7.1K" },
    { src: "/videos/video3.mp4", likes: "156.8K", comments: "12.4K" },
  ];

  const videosRow2 = [
    { src: "/videos/video4.mp4", likes: "98.4K", comments: "5.3K" },
    { src: "/videos/video5.mp4", likes: "112.7K", comments: "9.8K" },
  ];

  const videosRow3 = [
    { src: "/videos/video8.mp4", likes: "143.2K", comments: "11.5K" },
    { src: "/videos/video9.mp4", likes: "87.9K", comments: "6.7K" },
    { src: "/videos/video10.mp4", likes: "201.4K", comments: "15.3K" },
  ];

  return (
    <div className="px-3 py-4">
      {/* Videos Grid - Row 1 */}
      <div className="grid grid-cols-3 gap-1.5">
        {videosRow1.map((video, index) => (
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
        {videosRow2.map((video, index) => (
          <VideoPreview
            key={`row2-${index}`}
            src={video.src}
            likes={video.likes}
            comments={video.comments}
            onClick={onClickToSubscription}
          />
        ))}
        {/* Image with "Ver mais mídias" */}
        <div
          onClick={onClickToSubscription}
          className="relative aspect-[9/16] bg-card rounded-xl overflow-hidden clickable-area cursor-pointer"
        >
          <img
            src="/images/anitta-preview.png"
            alt="Preview"
            className="w-full h-full object-cover blur-sm"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
              <Images className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xs font-medium text-center px-2">Ver mais mídias</span>
            <span className="text-white/70 text-[10px] mt-1">+1.2K fotos e vídeos</span>
          </div>
        </div>
      </div>

      {/* Videos Grid - Row 3 */}
      <div className="grid grid-cols-3 gap-1.5 mt-1.5">
        {videosRow3.map((video, index) => (
          <VideoPreview
            key={`row3-${index}`}
            src={video.src}
            likes={video.likes}
            comments={video.comments}
            onClick={onClickToSubscription}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentGrid;
