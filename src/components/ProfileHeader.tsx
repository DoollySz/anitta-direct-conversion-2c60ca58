import profileImage from "@/assets/profile-anitta.png";
import bannerImage from "@/assets/banner.png";
import verifiedBadge from "@/assets/verified-badge.png";
interface ProfileHeaderProps {
  onClickToSubscription: () => void;
}
const ProfileHeader = ({
  onClickToSubscription
}: ProfileHeaderProps) => {
  return <div className="w-full">
      {/* Banner */}
      <div onClick={onClickToSubscription} className="w-full h-32 sm:h-40 relative clickable-area overflow-hidden">
        <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="flex items-end gap-4">
          <div onClick={onClickToSubscription} className="clickable-area cursor-pointer group">
            {/* Live story ring gradient */}
            <div className="w-[104px] h-[104px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 p-[3px] animate-pulse">
              <div className="w-full h-full rounded-full bg-background p-[3px]">
                <div className="w-full h-full rounded-full overflow-hidden shadow-glow">
                  <img src={profileImage} alt="Anitta" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold text-foreground">Anitta</h1>
            <img src={verifiedBadge} alt="Verificado" className="w-5 h-5" />
          </div>
          <p className="text-muted-foreground text-sm">@anitta</p>
        </div>

        <p className="mt-3 text-foreground text-sm leading-relaxed">😈 SEMPRE PELADINHA E FODENDO MUITO!

        <br />
          🔥 Conteúdo exclusivo +18, minha vida de putinha           
          <br />
          ​📽️ Vocês acham que eu não gosto de pirocada? Vem conferir...                     
        </p>

        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
          <span><strong className="text-foreground">1.2K</strong> posts</span>
          <span><strong className="text-foreground">89.5M</strong> likes</span>
        </div>
      </div>
    </div>;
};
export default ProfileHeader;