import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface FAQProps {
  onClickToPlans: () => void;
  lowestPrice: number;
}

const faqItems = [
  {
    question: "É sigiloso? Vai aparecer na fatura?",
    answer: "Sim, é 100% sigiloso. Na fatura aparecerá apenas um nome genérico, sem mencionar o conteúdo ou plataforma."
  },
  {
    question: "Quando tenho acesso depois do pagamento?",
    answer: "O acesso é liberado imediatamente após a confirmação do pagamento."
  },
  {
    question: "Posso cancelar quando quiser? A assinatura renova?",
    answer: "Sim, você pode cancelar a qualquer momento. A assinatura não renova automaticamente."
  },
  {
    question: "Tem reembolso?",
    answer: "Sim! Oferecemos garantia de 30 dias. Se não gostar, devolvemos 100% do seu dinheiro."
  },
  {
    question: 'Como funciona a "chamada de vídeo"?',
    answer: "Após assinar, você terá direito a 1 chamada de vídeo exclusiva. Basta agendar pelo chat."
  },
  {
    question: "Posso pedir conteúdo personalizado?",
    answer: "Sim! Assinantes podem fazer pedidos especiais de conteúdo personalizado."
  }
];

const FAQ = ({ onClickToPlans, lowestPrice }: FAQProps) => {
  return (
    <section className="px-4 py-6">
      <h2 className="text-xl font-bold text-primary mb-4">
        Perguntas Frequentes
      </h2>
      
      <Accordion type="single" collapsible className="space-y-2">
        {faqItems.map((item, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border border-border rounded-xl px-4 bg-card data-[state=open]:border-primary/30"
          >
            <AccordionTrigger className="text-sm text-foreground hover:no-underline py-4">
              <span className="text-left">{item.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pb-4">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* CTA Button */}
      <Button
        onClick={onClickToPlans}
        className="w-full mt-6 gradient-primary text-primary-foreground font-bold py-6 rounded-full text-base hover:opacity-90 transition-opacity animate-pulse-glow"
      >
        Veja tudo por apenas <span className="ml-1">R$ {lowestPrice.toFixed(2).replace('.', ',')}</span> →
      </Button>

      {/* Footer Links */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
        <span>•</span>
        <a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a>
      </div>
    </section>
  );
};

export default FAQ;
