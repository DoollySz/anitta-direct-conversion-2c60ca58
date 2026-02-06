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
      {/* Urgency Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white">
        <div className="max-w-lg mx-auto px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 animate-pulse" />
            <p className="font-bold text-sm tracking-wide">
              OFERTA EXPIRA EM: <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Special Offer Banner */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-lg mx-auto px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            <p className="font-bold text-sm">
              🔥 ÚLTIMA CHANCE: 50% DE DESCONTO EM TODOS OS PLANOS! 🔥
            </p>
          </div>
        </div>
      </div>

      {/* VSL Video */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div style={{ padding: "179.81% 0 0 0", position: "relative" }}>
          <iframe
            src="https://player.vimeo.com/video/1162429038?badge=0&autopause=0&player_id=0&app_id=58479&loop=1"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            title="BACKREDIRECT"
          />
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Profile Section */}
        <div className="text-center mb-6">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <img
              src={profileImage}
              alt="Anitta"
              className="w-full h-full rounded-full object-cover border-4 border-primary"
            />
            <img
              src={verifiedBadge}
              alt="Verificado"
              className="absolute -bottom-1 -right-1 w-8 h-8"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Espera! Não vá embora! 🥺
          </h1>
          <p className="text-muted-foreground">
            Preparamos uma oferta exclusiva só pra você
          </p>
        </div>

        {/* Discount Highlight */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary rounded-xl p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-3xl font-black text-primary">50% OFF</span>
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Desconto aplicado automaticamente em todos os planos
          </p>
        </div>

        {/* Plans Grid */}
        <div className="space-y-3 mb-6">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id, plan.priceInCents)}
              className="w-full bg-card border-2 border-border hover:border-primary rounded-xl p-4 transition-all duration-200 text-left relative overflow-hidden group"
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg text-foreground">{plan.name}</p>
                  <p className="text-sm text-muted-foreground">{plan.period}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground line-through">
                    R$ {plan.originalPrice.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-xl font-black text-primary">
                    R$ {plan.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                <CheckCircle className="w-4 h-4" />
                <span>Economia de R$ {plan.originalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <p className="font-bold text-foreground mb-3 text-center">
            ✨ O que você vai receber:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Acesso imediato ao conteúdo exclusivo</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Fotos e vídeos atualizados diariamente</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Suporte prioritário 24 horas</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Garantia de satisfação de 30 dias</span>
            </li>
          </ul>
        </div>

        {/* Urgency Text */}
        <p className="text-center text-sm text-muted-foreground">
          ⚠️ Esta oferta é válida apenas agora e não será repetida.
        </p>
      </main>
    </div>
  );
};

export default OfertaEspecial;
