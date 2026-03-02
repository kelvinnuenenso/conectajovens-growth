import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { formatBRPhone } from "@/lib/utils";

const formSchema = z.object({
  full_name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  phone: z.string().trim().optional().refine((val) => {
    if (!val) return true;
    const digits = val.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  }, {
    message: "O telefone deve ter 10 ou 11 dígitos (com DDD)",
  }),
});

type FormData = z.infer<typeof formSchema>;

const LeadCaptureSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    console.log("Tentando enviar lead para o Supabase...");

    try {
      // 1. Create contact
      const { data: contact, error: contactError } = await supabase
        .from("contacts")
        .insert({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
        })
        .select("id")
        .single();

      if (contactError) {
        console.error("Erro ao criar contato:", contactError);
        throw contactError;
      }

      console.log("Contato criado com sucesso:", contact.id);

      // 2. Create lead with source info
      const { error: leadError } = await supabase
        .from("leads")
        .insert({
          contact_id: contact.id,
          status: "new",
          metadata: {
            source_name: "Seção de Captura da Landpage",
          },
          initial_medium: "landpage",
          initial_campaign: "jovens-de-networking",
        });

      if (leadError) {
        console.error("Erro ao criar lead:", leadError);
        throw leadError;
      }

      console.log("Lead criado com sucesso!");
      toast({
        title: "Inscrição realizada! 🎉",
        description: "Em breve entraremos em contato com você.",
      });

      form.reset();
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Erro completo capturado na seção de captura:", error);
      console.log("Contexto do Erro:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        url: import.meta.env.VITE_SUPABASE_URL, // Verificando URL no momento do erro
      });
      
      let errorMessage = "Tente novamente em alguns instantes.";
      
      if (error.message === "Failed to fetch") {
        errorMessage = "Erro de conexão. Verifique as chaves do Supabase no arquivo .env";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao enviar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="captura" className="py-24 lg:py-32 bg-card/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Faça Parte
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Pronto para elevar seu <span className="text-primary">networking?</span>
            </h2>
            
            <p className="text-lg text-foreground/70">
              Junte-se a centenas de jovens que estão transformando suas carreiras através de conexões estratégicas. Preencha seus dados e nossa equipe entrará em contato.
            </p>

            <ul className="space-y-4">
              {[
                "Acesso exclusivo à comunidade",
                "Eventos e mentorias mensais",
                "Networking de alto nível",
                "Conteúdo prático e direto"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground/80">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Form Card or Success Message */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-2xl backdrop-blur-sm relative min-h-[400px] flex flex-col justify-center">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            
            {isSubmitted ? (
              <div className="text-center space-y-6 animate-fade-in py-12">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-4xl font-bold text-primary tracking-tight">Concluído</h3>
                <p className="text-lg text-foreground/70 max-w-[280px] mx-auto">
                  Sua inscrição foi recebida com sucesso. Em breve nossa equipe entrará em contato!
                </p>
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSubmitted(false)}
                    className="rounded-full px-8"
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 animate-fade-in">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Seu nome</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Como podemos te chamar?" 
                            className="h-12 bg-background/50" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Seu melhor e-mail</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@exemplo.com" 
                            className="h-12 bg-background/50" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Seu telefone (opcional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(00) 00000-0000" 
                            className="h-12 bg-background/50" 
                            {...field}
                            onChange={(e) => {
                              const formatted = formatBRPhone(e.target.value);
                              field.onChange(formatted);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 space-y-4">
                    <Button 
                      type="submit" 
                      size="xl"
                      className="w-full text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Quero entrar na comunidade"
                      )}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Seus dados estão seguros conosco.
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default LeadCaptureSection;
