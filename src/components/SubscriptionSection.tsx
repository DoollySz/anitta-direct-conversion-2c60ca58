import { Shield, Lock, Zap } from "lucide-react";
import SubscriptionCard from "./SubscriptionCard";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  badge?: string;
  isHighlighted?: boolean;
}

interface SubscriptionSectionProps {
  plans: Plan[];
  onSelectPlan: (planId: string) => void;
  promotionDate: string;
}

const SubscriptionSection = ({ plans, onSelectPlan, promotionDate }: SubscriptionSectionProps) => {
  const highlightedPlan = plans.find(p => p.isHighlighted);
  const otherPlans = plans.filter(p => !p.isHighlighted);

  return (
    <section id="subscription" className="px-4 py-6 space-y-4">
      {/* Promotion Header */}
      <div className="text-center space-y-1">
        <p className="text-primary text-sm font-medium flex items-center justify-center gap-2">
          <span>🔥</span>
          VEJA TUDO AGORA
          <span>🔥</span>
          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">Promocional</span>
        </p>
      </div>

      {/* Highlighted Plan */}
      {highlightedPlan && (
        <SubscriptionCard
          name={highlightedPlan.name}
          price={highlightedPlan.price}
          isHighlighted={true}
          onClick={() => onSelectPlan(highlightedPlan.id)}
        />
      )}

      {/* Security badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Pagamento 100% seguro
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Acesso imediato
        </span>
      </div>

      {/* Other Plans */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">Promoções</p>
        {otherPlans.map((plan) => (
          <SubscriptionCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            badge={plan.badge}
            onClick={() => onSelectPlan(plan.id)}
          />
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-card rounded-xl p-4 space-y-2 border border-border">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-primary">✓</span>
          <span className="text-foreground">Acesso a todos conteúdos exclusivos</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-primary">✓</span>
          <span className="text-foreground">Chat ao vivo com a Anitta</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-primary">✓</span>
          <span className="text-foreground">Vídeo chamada exclusiva</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-primary">✓</span>
          <span className="text-foreground">Presente surpresa para os +50 primeiros</span>
        </div>
      </div>

      {/* Guarantee */}
      <div className="flex items-center justify-center gap-2 py-2">
        <Shield className="w-5 h-5 text-green-400" />
        <p className="text-green-400 text-sm font-medium">
          Garantia de 30 dias – risco zero
        </p>
      </div>

      {/* Promotion Date */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center">
        <p className="text-primary text-sm font-medium">
          ⏰ PROMOÇÃO VÁLIDA ATÉ HOJE
        </p>
      </div>

      {/* Security Badge */}
      <div className="text-center text-muted-foreground text-xs flex items-center justify-center gap-2">
        <span>🔒</span>
        <span>Pagamento 100% Seguro | Dados Protegidos</span>
      </div>
    </section>
  );
};

export default SubscriptionSection;
