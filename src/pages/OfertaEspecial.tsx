import { useState, useEffect } from "react";
import { Clock, Zap, Gift, CheckCircle } from "lucide-react";
import profileImage from "@/assets/profile-anitta.png";
import verifiedBadge from "@/assets/verified-badge.png";

// Plans with 50% discount - prices in reais for display, will be converted to cents for API
const plans = [
  { id: "30dias", name: "30 Dias", originalPrice: 14.90, price: 7.45, priceInCents: 745, period: "Acesso por 1 mês" },
  { id: "3meses", name: "3 Meses", originalPrice: 24.90, price: 12.45, priceInCents: 1245, period: "Acesso por 3 meses", badge: "Mais popular" },
  { id: "1ano", name: "1 Ano", originalPrice: 47.90, price: 23.95, priceInCents: 2395, period: "Acesso por 1 ano", badge: "Melhor oferta" },
  { id: "vitalicio", name: "Vitalício", originalPrice: 87.90, price: 43.95, priceInCents: 4395, period: "Acesso para sempre", badge: "Exclusivo" },
];

const OfertaEspecial = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectPlan = (planId: string, priceInCents: number) => {
    const existingParams = new URLSearchParams(window.location.search);
    existingParams.set("plan", planId);
    existingParams.set("promo", priceInCents.toString());
    window.location.href = `/checkout?${existingParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Urgency Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-destructive/95 backdrop-blur-sm text-white shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-2.5 text-center">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 animate-pulse" />
            <p className="font-bold text-xs sm:text-sm tracking-wide">
              ⏰ OFERTA EXPIRA EM: <span className="font-mono text-base sm:text-lg bg-white/20 px-2 py-0.5 rounded">{formatTime(timeLeft)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Special Offer Banner */}
      <div className="fixed top-[42px] left-0 right-0 z-40 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground shadow-md">
        <div className="max-w-lg mx-auto px-4 py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Gift className="w-4 h-4" />
            <p className="font-bold text-xs sm:text-sm">
              🔥 50% DE DESCONTO EM TODOS OS PLANOS! 🔥
            </p>
          </div>
        </div>
      </div>

      {/* Spacer for fixed headers */}
      <div className="h-[84px]" />

      {/* VSL Video - Full Width */}
      <div className="w-full bg-black">
        <div className="max-w-2xl mx-auto">
          <div style={{ padding: "179.81% 0 0 0", position: "relative" }}>
            <iframe
              src="https://player.vimeo.com/video/1162432916?badge=0&autopause=0&player_id=0&app_id=58479&loop=1&autoplay=1&muted=0"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              title="BACKREDIRECT"
            />
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Profile Section - Compact */}
        <div className="text-center mb-5">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <img
              src={profileImage}
              alt="Anitta"
              className="w-full h-full rounded-full object-cover border-3 border-primary shadow-glow"
            />
            <img
              src={verifiedBadge}
              alt="Verificado"
              className="absolute -bottom-1 -right-1 w-7 h-7"
            />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1">
            Espera! Não vá embora! 🥺
          </h1>
          <p className="text-sm text-muted-foreground">
            Preparamos uma oferta exclusiva só pra você
          </p>
        </div>

        {/* Big Discount Highlight */}
        <div className="bg-gradient-to-br from-primary/30 via-primary/20 to-accent/20 border-2 border-primary rounded-2xl p-5 mb-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Zap className="w-8 h-8 text-primary animate-pulse" />
              <span className="text-4xl font-black text-primary drop-shadow-lg">50% OFF</span>
              <Zap className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">
              Desconto aplicado automaticamente
            </p>
          </div>
        </div>

        {/* Plans Grid - Compact Cards */}
        <div className="space-y-2.5 mb-5">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id, plan.priceInCents)}
              className="w-full bg-gradient-to-r from-card to-card/80 border-2 border-border hover:border-primary hover:shadow-glow rounded-xl p-3.5 transition-all duration-300 text-left relative overflow-hidden group"
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-bl-lg uppercase tracking-wide">
                  {plan.badge}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">{plan.period}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-muted-foreground line-through">
                    R$ {plan.originalPrice.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-xl font-black text-primary">
                    R$ {plan.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-primary/80">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Economia de R$ {(plan.originalPrice - plan.price).toFixed(2).replace(".", ",")}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Benefits - Compact */}
        <div className="bg-card/50 border border-border rounded-xl p-4 mb-5">
          <p className="font-bold text-sm text-foreground mb-2.5 text-center">
            ✨ O que você vai receber:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>Acesso imediato</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>Atualizações diárias</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>Suporte 24h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>Garantia 30 dias</span>
            </div>
          </div>
        </div>

        {/* Urgency Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground bg-destructive/10 border border-destructive/30 rounded-lg py-2 px-3">
            ⚠️ Esta oferta é válida apenas agora e não será repetida.
          </p>
        </div>
      </main>
    </div>
  );
};

export default OfertaEspecial;
