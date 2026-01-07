interface SubscriptionCardProps {
  name: string;
  price: number;
  period: string;
  onClick: () => void;
}

const SubscriptionCard = ({ name, price, period, onClick }: SubscriptionCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-secondary/50 hover:bg-secondary/70 border border-border hover:border-primary/50 rounded-xl p-4 transition-all duration-300 text-left group"
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-foreground font-semibold group-hover:text-primary transition-colors">
            {name}
          </h4>
          <p className="text-muted-foreground text-sm">{period}</p>
        </div>
        <div className="text-right">
          <span className="text-primary font-bold text-xl">
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>
    </button>
  );
};

export default SubscriptionCard;
