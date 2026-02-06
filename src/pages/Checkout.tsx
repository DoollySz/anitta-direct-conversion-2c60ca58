import { useState, useEffect } from "react";
import { Copy, Check, Loader2, CheckCircle, Shield, Lock, CheckSquare, ShieldCheck, Gift, Zap } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import checkoutBanner1 from "@/assets/checkout-banner1.png";
import checkoutBanner2 from "@/assets/checkout-banner2.png";
import pixLogo from "@/assets/pix-logo.png";

const plans: Record<string, { name: string; price: number }> = {
  "30dias": { name: "30 dias", price: 1490 },
  "3meses": { name: "3 meses", price: 2490 },
  "1ano": { name: "1 ano", price: 4790 },
  "vitalicio": { name: "Vitalício", price: 8790 },
};

// Helper to extract UTM and tracking params from URL
const getTrackingParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get("utm_source") || undefined,
    utm_medium: urlParams.get("utm_medium") || undefined,
    utm_campaign: urlParams.get("utm_campaign") || undefined,
    utm_content: urlParams.get("utm_content") || undefined,
    utm_term: urlParams.get("utm_term") || undefined,
    src: urlParams.get("src") || undefined,
    sck: urlParams.get("sck") || undefined,
  };
};

const Checkout = () => {
  const { toast } = useToast();
  
  // Get URL parameters directly from window.location
  const urlParams = new URLSearchParams(window.location.search);
  const planId = urlParams.get("plan") || "30dias";
  const promoPrice = urlParams.get("promo");
  const basePlan = plans[planId] || plans["30dias"];
  
  const plan = {
    name: basePlan.name,
    price: promoPrice ? parseInt(promoPrice, 10) : basePlan.price,
  };
  
  const [step, setStep] = useState<"pix" | "success">("pix");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<{
    qr_code: string;
    transaction_id: number;
    expires_at: string;
  } | null>(null);

  // Timer countdown (8 minutes = 480 seconds)
  const [timeLeft, setTimeLeft] = useState(480);
  const [timerExpired, setTimerExpired] = useState(false);

  // Scroll to top on mount and setup back redirect
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Back redirect setup
    const setupBackRedirect = () => {
      const currentParams = window.location.search;
      const backRedirectUrl = `/oferta-especial${currentParams}`;
      
      history.pushState({}, '', location.href);
      history.pushState({}, '', location.href);
      history.pushState({}, '', location.href);
      
      const handlePopState = () => {
        window.location.href = backRedirectUrl;
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    };
    
    const cleanup = setupBackRedirect();
    return cleanup;
  }, []);

  // Generate PIX automatically on mount
  useEffect(() => {
    const generatePix = async () => {
      try {
        const tracking = getTrackingParams();
        console.log('Generating PIX with tracking:', tracking);
        
        const { data, error } = await supabase.functions.invoke("create-pix", {
          body: {
            planId,
            planName: plan.name,
            amount: plan.price,
            customer: {
              name: "Cliente Privacy",
              email: "cliente@privacy.com",
              document: "00000000000",
              phone: "11999999999",
            },
            tracking: tracking,
          },
        });
        
        if (error) throw error;
        
        if (data.success) {
          setPixData({
            qr_code: data.qr_code,
            transaction_id: data.transaction_id,
            expires_at: data.expires_at,
          });
        } else {
          throw new Error(data.error || "Erro ao gerar PIX");
        }
      } catch (error: any) {
        console.error("Error creating PIX:", error);
        toast({
          title: "Erro ao gerar PIX",
          description: "Recarregue a página e tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    generatePix();
  }, [planId, plan.name, plan.price, toast]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerExpired(true);
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

  const copyToClipboard = async () => {
    if (pixData?.qr_code) {
      await navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Cole no app do seu banco.",
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  useEffect(() => {
    if (step !== "pix" || !pixData?.transaction_id) return;
    
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke("check-pix-status", {
          body: { transaction_id: pixData.transaction_id },
        });
        
        if (!error && data.status === "approved") {
          setStep("success");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error checking status:", err);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [step, pixData?.transaction_id]);

  const trustBadges = [
    {
      icon: Shield,
      title: "Dados protegidos",
      description: "Os seus dados são confidenciais e seguros.",
    },
    {
      icon: Lock,
      title: "Pagamento 100% Seguro",
      description: "As informações desta compra são criptografadas.",
    },
    {
      icon: CheckSquare,
      title: "Conteúdo Aprovado",
      description: "100% revisado e aprovado por profissionais.",
    },
    {
      icon: ShieldCheck,
      title: "Garantia de 30 dias",
      description: "Você está protegido por uma garantia de satisfação.",
    },
  ];

  const benefits = [
    "Acesso imediato após confirmação",
    "Conteúdos exclusivos diários",
    "Suporte prioritário 24h",
    "Atualizações gratuitas",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Timer Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-lg mx-auto px-4 py-2 text-center">
          {timerExpired ? (
            <p className="font-bold text-sm tracking-wide">AINDA DÁ TEMPO!</p>
          ) : (
            <p className="font-bold text-sm tracking-wide">
              A OFERTA ACABA EM: <span className="font-mono">{formatTime(timeLeft)}</span>
            </p>
          )}
        </div>
      </div>

      {/* Guarantee Banner */}
      <div className="bg-primary">
        <div className="max-w-lg mx-auto px-4 py-2 text-center">
          <p className="text-primary-foreground font-semibold text-sm">
            REEMBOLSO GARANTIDO EM ATÉ 30 DIAS!
          </p>
        </div>
      </div>

      {/* Banner 1 */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <img 
          src={checkoutBanner1} 
          alt="Privacy" 
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Plan Summary */}
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Plano selecionado</p>
              <p className="font-semibold text-lg text-foreground">{plan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-xl">
                R$ {(plan.price / 100).toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="mb-6">
          <img 
            src={checkoutBanner2} 
            alt="Anitta Exclusivo" 
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>

        {step === "pix" && (
          <div className="space-y-6">
            {/* Benefits Section */}
            <div className="bg-card border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">O que você vai receber:</h3>
              </div>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PIX Payment Method Box */}
            <div className="border-2 border-primary rounded-xl p-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
                <div className="flex items-center gap-2">
                  <img src={pixLogo} alt="PIX" className="w-6 h-6" />
                  <span className="font-bold text-foreground text-lg">PIX</span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs text-primary">
                  <Zap className="w-4 h-4" />
                  <span>Aprovação instantânea</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Gerando seu PIX...</p>
              </div>
            ) : pixData ? (
              <>
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2 text-foreground">Pague com PIX</h2>
                  <p className="text-muted-foreground text-sm">
                    Escaneie o QR Code ou copie o código
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 mx-auto w-fit">
                  <QRCodeSVG
                    value={pixData.qr_code}
                    size={192}
                    level="M"
                    includeMargin={false}
                  />
                </div>

                <button
                  onClick={copyToClipboard}
                  className="w-full bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary transition-colors"
                >
                  <span className="text-sm truncate pr-4 text-muted-foreground">
                    {pixData.qr_code.slice(0, 40)}...
                  </span>
                  {copied ? (
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <Copy className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </button>

                <button
                  onClick={copyToClipboard}
                  className="w-full gradient-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-glow"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Código copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copiar código PIX
                    </>
                  )}
                </button>

                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <p className="font-medium text-sm text-foreground">Como pagar:</p>
                  <ol className="text-sm text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      Abra o app do seu banco
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      Escolha pagar via PIX
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      Escaneie o QR Code ou cole o código
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">4.</span>
                      Confirme o pagamento
                    </li>
                  </ol>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Aguardando confirmação do pagamento...
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Erro ao gerar PIX. Recarregue a página.</p>
              </div>
            )}

            {/* Secure Payment Text */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Pagamento seguro via PIX com aprovação imediata.</span>
            </div>

            {/* Trust Badges */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <badge.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{badge.title}</p>
                    <p className="text-muted-foreground text-xs">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Pagamento confirmado!
              </h2>
              <p className="text-muted-foreground">
                Sua assinatura foi ativada com sucesso.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Você receberá o acesso em breve.
              </p>
              <p className="font-medium text-foreground">Verifique seu WhatsApp!</p>
            </div>

            <button
              onClick={() => {
                window.location.href = "/privacy" + window.location.search;
              }}
              className="w-full bg-card border border-border font-medium py-3 rounded-xl hover:border-primary transition-colors text-foreground"
            >
              Voltar para o início
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
