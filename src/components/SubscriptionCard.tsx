import { Crown, Flame, Gift, Star } from "lucide-react";

interface SubscriptionCardProps {
  name: string;
  price: number;
  period?: string;
  badge?: string;
  isHighlighted?: boolean;
  onClick: () => void;
}

const getBadgeIcon = (badge?: string) => {
  switch (badge) {
    case "Mais popular":
      return <Flame className="w-3 h-3" />;
    case "Melhor oferta":
      return <Star className="w-3 h-3" />;
    case "Exclusivo":
      return <Gift className="w-3 h-3" />;
    default:
      return null;
  }
};

const SubscriptionCard = ({ name, price, badge, isHighlighted, onClick }: SubscriptionCardProps) => {
  if (isHighlighted) {
    return (
      <button
        onClick={onClick}
        className="w-full gradient-primary rounded-2xl p-4 transition-all duration-300 text-left animate-pulse-glow"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary-foreground" />
            <span className="text-primary-foreground font-bold text-lg">{name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary-foreground font-bold text-xl">
              R$ {price.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-primary-foreground">→</span>
          </div>
        </div>
        <p className="text-primary-foreground/80 text-xs mt-2 flex items-center gap-1">
          + CHAMADA DE VÍDEO COMIGO HOJE!
        </p>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full bg-card border border-border hover:border-primary/50 rounded-xl p-4 transition-all duration-300 text-left group"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-foreground font-semibold">{name}</span>
          {badge && (
            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              {getBadgeIcon(badge)}
              {badge}
            </span>
          )}
        </div>
        <span className="text-primary font-bold">
          R$ {price.toFixed(2).replace('.', ',')}
        </span>
      </div>
    </button>
  );
};

export default SubscriptionCard;
