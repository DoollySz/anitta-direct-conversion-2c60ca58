import logoImage from "@/assets/logo.webp";
import { useBackRedirect } from "@/hooks/useBackRedirect";

const AgeVerification = () => {
  // Back redirect to special offer page
  useBackRedirect("/oferta-especial");
  const handleConfirmAge = () => {
    // Store verification in localStorage
    localStorage.setItem("age_verified", "true");
    // Preserve all URL parameters when navigating
    window.location.href = "/privacy" + window.location.search;
  };
  
  const handleDenyAge = () => {
    // Store verification and redirect to privacy (same as confirm)
    localStorage.setItem("age_verified", "true");
    window.location.href = "/privacy" + window.location.search;
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative curves with theme colors */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path 
            d="M 180 0 Q 200 100 180 200" 
            fill="none" 
            stroke="hsl(24, 100%, 55%)" 
            strokeWidth="40" 
            strokeLinecap="round" 
            opacity="0.3"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path 
            d="M 20 0 Q 0 100 20 200" 
            fill="none" 
            stroke="hsl(24, 100%, 55%)" 
            strokeWidth="40" 
            strokeLinecap="round" 
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-2xl shadow-xl p-8 max-w-sm w-full text-center relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={logoImage} alt="Privacy" className="h-8" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-3">
          VERIFICAÇÃO DE IDADE
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-8">
          Para acessar este conteúdo exclusivo para adultos,
          <br />
          confirme que você tem mais de +18 anos.
        </p>

        {/* Confirm Button */}
        <button 
          onClick={handleConfirmAge} 
          className="w-full gradient-primary hover:opacity-90 text-primary-foreground font-bold py-4 rounded-full text-sm uppercase tracking-wide transition-all shadow-glow mb-4"
        >
          SIM, TENHO MAIS DE 18 ANOS
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-muted-foreground text-sm">ou</span>
        </div>

        {/* Deny Button */}
        <button 
          onClick={handleDenyAge} 
          className="w-full bg-secondary border border-border hover:bg-secondary/80 text-foreground font-semibold py-4 rounded-full text-sm uppercase tracking-wide transition-colors"
        >
          NÃO, SOU MENOR DE IDADE
        </button>

        {/* Terms */}
        <p className="text-muted-foreground text-xs mt-6 leading-relaxed">
          Ao continuar, você confirma que possui 18 anos ou mais e concorda
          <br />
          com nossos{" "}
          <a href="#" className="text-primary hover:underline">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" className="text-primary hover:underline">
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default AgeVerification;
