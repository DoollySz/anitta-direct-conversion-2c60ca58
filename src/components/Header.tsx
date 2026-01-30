const Header = () => {
  // Get current date in Brazilian format
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Promotion Banner - Fixed */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-primary via-orange-500 to-primary">
        <div className="max-w-lg mx-auto px-4 py-2 text-center">
          <p className="text-primary-foreground font-bold text-sm tracking-wide flex items-center justify-center gap-2">
            <span className="animate-pulse">🔥</span>
            PROMOÇÃO VÁLIDA ATÉ {getCurrentDate()}
            <span className="animate-pulse">🔥</span>
          </p>
        </div>
      </div>

      {/* Logo Header */}
      <header className="sticky top-[40px] z-40 glass border-b border-border">
        <div className="flex items-center justify-center h-14 px-[25px]">
          <img 
            alt="Privacy" 
            src="/lovable-uploads/a5e06ac2-c873-4e71-a7ea-ecce987b9591.png" 
            className="h-7 rounded-none object-fill" 
          />
        </div>
      </header>
    </>
  );
};

export default Header;