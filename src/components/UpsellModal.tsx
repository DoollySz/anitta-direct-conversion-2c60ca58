import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm mx-4 p-6 rounded-2xl">
        <DialogTitle className="sr-only">Oferta Especial</DialogTitle>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center">
            <span className="text-3xl">🔥</span>
          </div>
          
          <h3 className="text-xl font-bold text-foreground">
            Espera! Oferta Especial
          </h3>
          
          <p className="text-muted-foreground text-sm">
            Por apenas <span className="text-primary font-bold">+R$ {extraCost.toFixed(2).replace('.', ',')}</span> você pode ter acesso ao plano{" "}
            <span className="font-semibold text-foreground">{upgradePlan.name}</span>!
          </p>

          <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">De:</span>
              <span className="text-muted-foreground line-through text-sm">
                R$ {upgradePlan.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground font-semibold">Por:</span>
              <span className="text-primary font-bold text-xl">
                R$ {upgradePlan.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="pt-2 border-t border-border">
              <span className="text-green-400 text-sm font-medium">
                ✨ Economia de R$ {savings.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={onAccept}
              className="w-full gradient-primary text-primary-foreground font-bold py-6 rounded-xl text-base hover:opacity-90 transition-opacity"
            >
              Quero o plano maior! 🚀
            </Button>
            
            <button
              onClick={onDecline}
              className="w-full text-muted-foreground text-sm hover:text-foreground transition-colors py-2"
            >
              Agora não, continuar com {originalPlan.name}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpsellModal;
