import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Vagas limitadas</span>
          </div>
          
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Comece a fazer parte da{" "}
            <span className="text-primary">geração que cresce junto</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-10">
            Não espere mais para construir as conexões que vão transformar sua carreira e seus negócios.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#captura" className="w-full sm:w-auto">
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full"
              >
                Quero Entrar Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
              Falar com a Equipe
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-12 border-t border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Comunidade</div>
              <div className="text-sm text-foreground/60">Crescimento real</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Networking</div>
              <div className="text-sm text-foreground/60">Conexões valiosas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-foreground/60">Seguro</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
