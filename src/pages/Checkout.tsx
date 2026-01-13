import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Copy, Check, Loader2, CheckCircle, Shield, Lock, CheckSquare, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import checkoutBanner1 from "@/assets/checkout-banner1.png";
import checkoutBanner2 from "@/assets/checkout-banner2.png";

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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Timer Header */}
      <div className="bg-[#dc2626] text-white">
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
      <div className="bg-[#1a1a1a] border-b border-[#333]">
        <div className="max-w-lg mx-auto px-4 py-2 text-center">
          <p className="text-[#22c55e] font-semibold text-sm">
            REEMBOLSO GARANTIDO EM ATÉ 30 DIAS!
          </p>
        </div>
      </div>

      {/* Banner 1 */}
      <div className="w-full">
        <img 
          src={checkoutBanner1} 
          alt="Privacy" 
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Banner 2 */}
      <div className="w-full">
        <img 
          src={checkoutBanner2} 
          alt="Anitta Exclusivo" 
          className="w-full h-auto object-cover"
        />
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Plan Summary */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Plano selecionado</p>
              <p className="font-semibold text-lg text-white">{plan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-[#ff4d4d] font-bold text-xl">
                R$ {(plan.price / 100).toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>

        {step === "form" && (
          <div className="space-y-6">
            {/* PIX Payment Method Box */}
            <div className="border-2 border-[#dc2626] rounded-xl p-4 bg-[#1a1a1a]">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="w-5 h-5 rounded-full border-2 border-[#dc2626] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#dc2626]"></div>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 512 512" className="w-6 h-6" fill="none">
                    <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.9 231.1 518.9 200.8 488.6L103.3 391.2H112.6C132.6 391.2 151.5 383.4 165.7 369.2L242.4 292.5ZM262.5 218.9C257.1 224.4 247.9 224.4 242.4 218.9L165.7 142.2C151.5 128 132.6 120.2 112.6 120.2H103.3L200.2 23.3C230.5-7 279.7-7 310 23.3L407.7 120.9H392.6C372.6 120.9 353.7 128.7 339.5 142.9L262.5 218.9Z" fill="#32BCAD"/>
                    <path d="M78.3 391.2H112.6C126.6 391.2 140.1 385.6 150.3 375.4L227 298.9C235.5 290.3 247.5 285.5 259.9 285.5C272.4 285.5 284.4 290.3 292.9 298.9L369.5 375.6C379.7 385.8 393.2 391.4 407.2 391.4H441.5L488.6 438.5C518.9 468.8 518.9 518 488.6 548.3L441.5 501.2L407.2 501.4C393.2 501.4 379.7 495.8 369.5 485.6L292.9 408.9C284.4 400.4 272.4 395.6 259.9 395.6C247.5 395.6 235.5 400.4 227 408.9L150.3 485.4C140.1 495.6 126.6 501.2 112.6 501.2H78.3L23.3 456.3C-6.9 426-6.9 376.8 23.3 346.5L78.3 391.2Z" fill="#32BCAD"/>
                    <path d="M441.5 120.9L488.6 73.8C518.9 103.5 518.9 152.7 488.6 183L441.5 229.1L407.2 229.3C393.2 229.3 379.7 223.7 369.5 213.5L292.9 136.8C284.4 128.3 272.4 123.5 259.9 123.5C247.5 123.5 235.5 128.3 227 136.8L150.3 213.3C140.1 223.5 126.6 229.1 112.6 229.1H78.3L23.3 183C-6.9 152.7-6.9 103.5 23.3 73.2L78.3 120.2H112.6C126.6 120.2 140.1 125.8 150.3 136L227 212.7C235.5 221.2 247.5 226 259.9 226C272.4 226 284.4 221.2 292.9 212.7L369.5 136C379.7 125.8 393.2 120.2 407.2 120.2L441.5 120.9Z" fill="#32BCAD"/>
                  </svg>
                  <span className="font-bold text-white text-lg">PIX</span>
                </div>
              </label>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl focus:ring-2 focus:ring-[#ff4d4d] focus:border-[#ff4d4d] transition-colors text-white placeholder:text-gray-500"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Telefone (com DDD)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl focus:ring-2 focus:ring-[#ff4d4d] focus:border-[#ff4d4d] transition-colors text-white placeholder:text-gray-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#ff4d4d] to-[#ff6b6b] hover:from-[#ff3333] hover:to-[#ff4d4d] text-white font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ff4d4d]/30"
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

            {/* Trust Badges */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4 space-y-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-[#22c55e]/10 rounded-lg flex-shrink-0">
                    <badge.icon className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{badge.title}</p>
                    <p className="text-gray-400 text-xs">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "pix" && pixData && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2 text-white">Pague com PIX</h2>
              <p className="text-gray-400 text-sm">
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
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl p-4 flex items-center justify-between hover:border-[#ff4d4d] transition-colors"
            >
              <span className="text-sm truncate pr-4 text-gray-400">
                {pixData.qr_code.slice(0, 40)}...
              </span>
              {copied ? (
                <Check className="w-5 h-5 text-[#22c55e] flex-shrink-0" />
              ) : (
                <Copy className="w-5 h-5 text-[#ff4d4d] flex-shrink-0" />
              )}
            </button>

            <button
              onClick={copyToClipboard}
              className="w-full bg-gradient-to-r from-[#ff4d4d] to-[#ff6b6b] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#ff4d4d]/30"
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

            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4 space-y-3">
              <p className="font-medium text-sm text-white">Como pagar:</p>
              <ol className="text-sm text-gray-400 space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#ff4d4d] font-bold">1.</span>
                  Abra o app do seu banco
                </li>
                <li className="flex gap-2">
                  <span className="text-[#ff4d4d] font-bold">2.</span>
                  Escolha pagar via PIX
                </li>
                <li className="flex gap-2">
                  <span className="text-[#ff4d4d] font-bold">3.</span>
                  Escaneie o QR Code ou cole o código
                </li>
                <li className="flex gap-2">
                  <span className="text-[#ff4d4d] font-bold">4.</span>
                  Confirme o pagamento
                </li>
              </ol>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Aguardando confirmação do pagamento...
            </div>

            {/* Trust Badges on PIX step too */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4 space-y-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-[#22c55e]/10 rounded-lg flex-shrink-0">
                    <badge.icon className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{badge.title}</p>
                    <p className="text-gray-400 text-xs">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 mx-auto bg-[#22c55e]/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#22c55e]" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-[#22c55e] mb-2">
                Pagamento confirmado!
              </h2>
              <p className="text-gray-400">
                Sua assinatura foi ativada com sucesso.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">
                Você receberá o acesso no e-mail:
              </p>
              <p className="font-medium text-white">{formData.email}</p>
            </div>

            <button
              onClick={() => navigate("/privacy")}
              className="w-full bg-[#1a1a1a] border border-[#333] font-medium py-3 rounded-xl hover:border-[#ff4d4d] transition-colors text-white"
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
