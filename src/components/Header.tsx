import logo from "@/assets/logo.webp";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="flex items-center justify-center h-14 px-4">
        <img src={logo} alt="Privacy" className="h-7" />
      </div>
    </header>
  );
};

export default Header;
