import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Gift, Clock } from "lucide-react";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalPlan: {
    name: string;
    price: number;
  };
  upgradePlan: {
    name: string;
    price: number;
    originalPrice: number;
  };
  onAccept: () => void;
  onDecline: () => void;
}

const UpsellModal = ({
  isOpen,
  onClose,
  originalPlan,
  upgradePlan,
  onAccept,
  onDecline,
}: UpsellModalProps) => {
  const savings = upgradePlan.originalPrice - upgradePlan.price;
  const extraCost = upgradePlan.price - originalPlan.price;
  const discountPercent = Math.round((savings / upgradePlan.originalPrice) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-card to-background border-primary/20 w-[calc(100%-2rem)] max-w-sm mx-auto p-0 rounded-2xl overflow-hidden">
        <DialogTitle className="sr-only">Oferta Especial</DialogTitle>
        
        {/* Header com gradiente */}
        <div className="gradient-primary px-5 py-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50"></div>
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
              <span className="text-primary-foreground font-bold text-lg">OFERTA EXCLUSIVA</span>
              <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
            </div>
            <p className="text-primary-foreground/90 text-sm">Válida apenas agora!</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Badge de desconto */}
          <div className="flex justify-center -mt-8">
            <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-lg animate-scale-in">
              -{discountPercent}% OFF
            </div>
          </div>

          {/* Upgrade info */}
          <div className="text-center space-y-2">
            <p className="text-muted-foreground text-sm">
              Faça upgrade para o plano
            </p>
            <h3 className="text-2xl font-bold text-foreground">
              {upgradePlan.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              Por apenas <span className="text-primary font-bold text-base">+R$ {extraCost.toFixed(2).replace('.', ',')}</span>
            </p>
          </div>

          {/* Preço box */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">Preço normal:</span>
              </div>
              <span className="text-muted-foreground line-through">
                R$ {upgradePlan.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Gift className="w-4 h-4 text-primary" />
                <span>Seu preço:</span>
              </div>
              <span className="text-primary font-bold text-2xl">
                R$ {upgradePlan.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <div className="pt-2 border-t border-border flex items-center justify-center gap-2">
              <span className="text-primary font-semibold">
                Você economiza R$ {savings.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Timer urgency */}
          <div className="flex items-center justify-center gap-2 text-primary text-sm">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>Esta oferta expira em breve!</span>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={onAccept}
              className="w-full gradient-primary text-primary-foreground font-bold py-6 rounded-xl text-base hover:opacity-90 transition-all shadow-glow group"
            >
              <span>SIM, QUERO O UPGRADE!</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <button
              onClick={onDecline}
              className="w-full text-muted-foreground text-xs hover:text-foreground transition-colors py-2 opacity-70 hover:opacity-100"
            >
              Não, obrigado. Continuar com {originalPlan.name}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpsellModal;
