import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const plan = plans[planId] || plans["30dias"];
  
  const [step, setStep] = useState<"form" | "pix" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<{
    qr_code: string;
    qr_code_base64: string;
    transaction_id: number;
    expires_at: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    document: "",
    phone: "",
  });

  // Format CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  // Format phone
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
    
    if (name === "document") {
      setFormData(prev => ({ ...prev, [name]: formatCPF(value) }));
    } else if (name === "phone") {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate CPF (11 digits)
    const cpfNumbers = formData.document.replace(/\D/g, "");
    if (cpfNumbers.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "Digite um CPF válido com 11 dígitos.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate phone (10 or 11 digits)
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
          customer: formData,
        },
      });
      
      if (error) throw error;
      
      if (data.success) {
        setPixData({
          qr_code: data.qr_code,
          qr_code_base64: data.qr_code_base64,
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

  // Poll for payment status
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/privacy")}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Finalizar Assinatura</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Plan Summary */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Plano selecionado</p>
              <p className="font-semibold text-lg">{plan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-xl">
                R$ {(plan.price / 100).toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Seu nome completo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">CPF</label>
              <input
                type="text"
                name="document"
                value={formData.document}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="000.000.000-00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Telefone (com DDD)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="(11) 99999-9999"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                "Gerar código PIX"
              )}
            </button>
            
            <p className="text-center text-xs text-muted-foreground">
              🔒 Pagamento 100% seguro via PIX
            </p>
          </form>
        )}

        {step === "pix" && pixData && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Pague com PIX</h2>
              <p className="text-muted-foreground text-sm">
                Escaneie o QR Code ou copie o código
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-4 mx-auto w-fit">
              <img
                src={pixData.qr_code_base64}
                alt="QR Code PIX"
                className="w-48 h-48"
              />
            </div>

            {/* Copy Code Button */}
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
              className="w-full gradient-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2"
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

            {/* Instructions */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <p className="font-medium text-sm">Como pagar:</p>
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
              <p className="font-medium">{formData.email}</p>
            </div>

            <button
              onClick={() => navigate("/privacy")}
              className="w-full bg-card border border-border font-medium py-3 rounded-xl hover:border-primary transition-colors"
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
