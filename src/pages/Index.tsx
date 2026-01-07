import { useState, useRef } from "react";
import Header from "@/components/Header";
import ProfileHeader from "@/components/ProfileHeader";
import ContentGrid from "@/components/ContentGrid";
import SubscriptionSection from "@/components/SubscriptionSection";
import UpsellModal from "@/components/UpsellModal";

const plans = [
  { id: "30days", name: "30 dias", price: 14.90, period: "Acesso por 1 mês" },
  { id: "3months", name: "3 meses", price: 24.90, period: "Acesso por 3 meses" },
  { id: "1year", name: "1 ano", price: 47.90, period: "Acesso por 1 ano" },
  { id: "lifetime", name: "Vitalício", price: 87.90, period: "Acesso para sempre" },
];

const upsellOffers: Record<string, { name: string; price: number; originalPrice: number; targetPlanId: string }> = {
  "30days": { name: "3 meses", price: 19.90, originalPrice: 24.90, targetPlanId: "3months" },
  "3months": { name: "1 ano", price: 37.90, originalPrice: 47.90, targetPlanId: "1year" },
  "1year": { name: "Vitalício", price: 67.90, originalPrice: 87.90, targetPlanId: "lifetime" },
};

const Index = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);
  const subscriptionRef = useRef<HTMLDivElement>(null);

  // Generate dynamic date (current date + 7 days)
  const getPromotionDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const scrollToSubscription = () => {
    subscriptionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    
    // Check if there's an upsell offer for this plan
    if (upsellOffers[planId]) {
      setShowUpsell(true);
    } else {
      // Lifetime plan - proceed directly
      handleProceedToCheckout(planId);
    }
  };

  const handleProceedToCheckout = (planId: string) => {
    // Here you would redirect to checkout
    console.log(`Proceeding to checkout with plan: ${planId}`);
    // For now, we'll just show an alert
    alert(`Redirecionando para pagamento do plano: ${plans.find(p => p.id === planId)?.name}`);
  };

  const handleAcceptUpsell = () => {
    if (selectedPlanId && upsellOffers[selectedPlanId]) {
      handleProceedToCheckout(upsellOffers[selectedPlanId].targetPlanId);
    }
    setShowUpsell(false);
    setSelectedPlanId(null);
  };

  const handleDeclineUpsell = () => {
    if (selectedPlanId) {
      handleProceedToCheckout(selectedPlanId);
    }
    setShowUpsell(false);
    setSelectedPlanId(null);
  };

  const selectedPlan = selectedPlanId ? plans.find(p => p.id === selectedPlanId) : null;
  const upsellOffer = selectedPlanId ? upsellOffers[selectedPlanId] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-lg mx-auto pb-20">
        <ProfileHeader onClickToSubscription={scrollToSubscription} />
        
        <div ref={subscriptionRef}>
          <SubscriptionSection
            plans={plans}
            onSelectPlan={handleSelectPlan}
            promotionDate={getPromotionDate()}
          />
        </div>
        
        <ContentGrid onClickToSubscription={scrollToSubscription} />
      </main>

      {/* Upsell Modal */}
      {selectedPlan && upsellOffer && (
        <UpsellModal
          isOpen={showUpsell}
          onClose={() => setShowUpsell(false)}
          originalPlan={{ name: selectedPlan.name, price: selectedPlan.price }}
          upgradePlan={upsellOffer}
          onAccept={handleAcceptUpsell}
          onDecline={handleDeclineUpsell}
        />
      )}
    </div>
  );
};

export default Index;
