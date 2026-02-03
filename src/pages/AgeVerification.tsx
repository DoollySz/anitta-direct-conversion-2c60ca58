import logoImage from "@/assets/logo.webp";

const AgeVerification = () => {
  const handleConfirmAge = () => {
    // Store verification in localStorage
    localStorage.setItem("age_verified", "true");
    // Preserve all URL parameters when navigating
    window.location.href = "/privacy" + window.location.search;
  };
  const handleDenyAge = () => {
    window.location.href = "https://www.google.com";
  };
  return <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative curves */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M 180 0 Q 200 100 180 200" fill="none" stroke="hsl(24, 100%, 85%)" strokeWidth="40" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M 20 0 Q 0 100 20 200" fill="none" stroke="hsl(24, 100%, 85%)" strokeWidth="40" strokeLinecap="round" />
        </svg>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={logoImage} alt="Privacy" className="h-8" />
          
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          VERIFICAÇÃO DE IDADE
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-8">
          Para acessar este conteúdo exclusivo para adultos,
          <br />
          confirme que você tem mais de +18 anos.
        </p>

        {/* Confirm Button */}
        <button onClick={handleConfirmAge} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full text-sm uppercase tracking-wide transition-colors mb-4">
          SIM, TENHO MAIS DE 18 ANOS
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-gray-400 text-sm">ou</span>
        </div>

        {/* Deny Button */}
        <button onClick={handleDenyAge} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-4 rounded-full text-sm uppercase tracking-wide transition-colors">
          NÃO, SOU MENOR DE IDADE
        </button>

        {/* Terms */}
        <p className="text-gray-400 text-xs mt-6 leading-relaxed">
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
    </div>;
};
export default AgeVerification;