import { useState } from "react";
import { User, Mail, FileText, ArrowRight, Loader2 } from "lucide-react";

interface CustomerFormProps {
  onSubmit: (data: { name: string; email: string; document: string }) => void;
  loading: boolean;
}

// CPF formatting: 000.000.000-00
const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

// Basic CPF validation
const isValidCPF = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(digits[10]);
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const CustomerForm = ({ onSubmit, loading }: CustomerFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = "Informe seu nome completo";
    } else if (trimmedName.length < 3 || !trimmedName.includes(" ")) {
      newErrors.name = "Informe nome e sobrenome";
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Informe seu e-mail";
    } else if (!isValidEmail(trimmedEmail)) {
      newErrors.email = "E-mail inválido";
    }

    const rawDoc = document.replace(/\D/g, "");
    if (!rawDoc) {
      newErrors.document = "Informe seu CPF";
    } else if (!isValidCPF(rawDoc)) {
      newErrors.document = "CPF inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      document: document.replace(/\D/g, ""),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold text-foreground">Preencha seus dados</h2>
        <p className="text-sm text-muted-foreground">Para gerar o PIX, precisamos de algumas informações</p>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <User className="w-4 h-4 text-primary" />
          Nome completo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome completo"
          maxLength={100}
          className={`w-full bg-card border ${errors.name ? "border-destructive" : "border-border"} rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors`}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-primary" />
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@gmail.com"
          maxLength={255}
          className={`w-full bg-card border ${errors.email ? "border-destructive" : "border-border"} rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors`}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      {/* CPF */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-primary" />
          CPF
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={document}
          onChange={(e) => setDocument(formatCPF(e.target.value))}
          placeholder="000.000.000-00"
          className={`w-full bg-card border ${errors.document ? "border-destructive" : "border-border"} rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors`}
        />
        {errors.document && <p className="text-xs text-destructive">{errors.document}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full gradient-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-glow disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Gerando PIX...
          </>
        ) : (
          <>
            Gerar PIX
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Seus dados estão protegidos e são usados apenas para o pagamento.
      </p>
    </form>
  );
};

export default CustomerForm;
