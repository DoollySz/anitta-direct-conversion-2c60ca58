import profileImage from "@/assets/profile-anitta.png";
import bannerImage from "@/assets/banner.png";
import verifiedBadge from "@/assets/verified-badge.png";

interface ProfileHeaderProps {
  onClickToSubscription: () => void;
}

const ProfileHeader = ({ onClickToSubscription }: ProfileHeaderProps) => {
  return (
    <div className="w-full">
      {/* Banner */}
      <div 
        onClick={onClickToSubscription}
        className="w-full h-32 sm:h-40 relative clickable-area overflow-hidden"
      >
        <img
          src={bannerImage}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="flex items-end gap-4">
          <div 
            onClick={onClickToSubscription}
            className="clickable-area"
          >
            <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden shadow-glow">
              <img
                src={profileImage}
                alt="Anitta"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold text-foreground">Anitta</h1>
            <img 
              src={verifiedBadge} 
              alt="Verificado" 
              className="w-5 h-5"
            />
          </div>
          <p className="text-muted-foreground text-sm">@anitta</p>
        </div>

        <p className="mt-3 text-foreground text-sm leading-relaxed">
          🔥 Conteúdo exclusivo que você não encontra em nenhum outro lugar
          <br />
          💋 Acesso VIP aos meus bastidores
          <br />
          📸 Fotos e vídeos especiais só para assinantes
        </p>

        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
          <span><strong className="text-foreground">1.2K</strong> posts</span>
          <span><strong className="text-foreground">89.5M</strong> likes</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
