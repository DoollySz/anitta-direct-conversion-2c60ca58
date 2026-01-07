import { Shield, Phone } from "lucide-react";
import SubscriptionCard from "./SubscriptionCard";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
}

interface SubscriptionSectionProps {
  plans: Plan[];
  onSelectPlan: (planId: string) => void;
  promotionDate: string;
}

const SubscriptionSection = ({ plans, onSelectPlan, promotionDate }: SubscriptionSectionProps) => {
  return (
    <section id="subscription" className="px-4 py-6 space-y-4">
      {/* Promotion Banner */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center">
        <p className="text-primary text-sm font-medium">
          ⏰ PROMOÇÃO VÁLIDA ATÉ {promotionDate}
        </p>
      </div>

      {/* Subscription Cards */}
      <div className="space-y-3">
        {plans.map((plan) => (
          <SubscriptionCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            period={plan.period}
            onClick={() => onSelectPlan(plan.id)}
          />
        ))}
      </div>

      {/* Video Call Benefit */}
      <div className="flex items-center justify-center gap-2 py-3">
        <Phone className="w-4 h-4 text-primary" />
        <p className="text-muted-foreground text-sm">
          Todas as assinaturas incluem <span className="text-foreground font-medium">1 chamada de vídeo</span>
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-card rounded-xl p-4 space-y-3">
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
      <div className="flex items-center justify-center gap-2 py-4">
        <Shield className="w-5 h-5 text-green-400" />
        <p className="text-green-400 text-sm font-medium">
          Garantia de 30 dias – risco zero
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
