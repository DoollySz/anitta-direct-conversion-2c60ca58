import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Copy, Check, Loader2, CheckCircle, Shield, Lock, CheckSquare, ShieldCheck } from "lucide-react";
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

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const planId = searchParams.get("plan") || "30dias";
  const promoPrice = searchParams.get("promo");
  const basePlan = plans[planId] || plans["30dias"];
  
  const plan = {
    name: basePlan.name,
    price: promoPrice ? parseInt(promoPrice, 10) : basePlan.price,
  };
  
  const [step, setStep] = useState<"form" | "pix" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<{
    qr_code: string;
    transaction_id: number;
    expires_at: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  // Timer countdown (8 minutes = 480 seconds)
  const [timeLeft, setTimeLeft] = useState(480);
  const [timerExpired, setTimerExpired] = useState(false);

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

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneNumbers = formData.phone.replace(/\D/g, "");
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      toast({
        title: "Telefone inválido",
        description: "Digite um telefone válido com DDD.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("create-pix", {
        body: {
          planId,
          planName: plan.name,
          amount: plan.price,
          customer: {
            email: formData.email,
            phone: formData.phone,
          },
        },
      });
      
      if (error) throw error;
      
      if (data.success) {
        setPixData({
          qr_code: data.qr_code,
          transaction_id: data.transaction_id,
          expires_at: data.expires_at,
        });
        setStep("pix");
      } else {
        throw new Error(data.error || "Erro ao gerar PIX");
      }
    } catch (error: any) {
      console.error("Error creating PIX:", error);
      toast({
        title: "Erro ao gerar PIX",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

      {/* Guarantee Banner - Orange with white text */}
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

        {/* Banner 2 - Below plan summary */}
        <div className="mb-6">
          <img 
            src={checkoutBanner2} 
            alt="Anitta Exclusivo" 
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>

        {step === "form" && (
          <div className="space-y-6">
            {/* Identification Form */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-foreground mb-4">Identificação</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Telefone (com DDD)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            {/* PIX Payment Method Box - Below form */}
            <div className="border-2 border-primary rounded-xl p-4 bg-card">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
                <div className="flex items-center gap-2">
                  <img src={pixLogo} alt="PIX" className="w-6 h-6" />
                  <span className="font-bold text-foreground text-lg">PIX</span>
                </div>
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary hover:opacity-90 text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-glow"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando PIX...
                  </>
                ) : (
                  "FINALIZAR PAGAMENTO"
                )}
              </button>
            </form>

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

        {step === "pix" && pixData && (
          <div className="space-y-6">
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
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
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

            {/* Trust Badges on PIX step too */}
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
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-green-500 mb-2">
                Pagamento confirmado!
              </h2>
              <p className="text-muted-foreground">
                Sua assinatura foi ativada com sucesso.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Você receberá o acesso no e-mail:
              </p>
              <p className="font-medium text-foreground">{formData.email}</p>
            </div>

            <button
              onClick={() => navigate("/privacy")}
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
