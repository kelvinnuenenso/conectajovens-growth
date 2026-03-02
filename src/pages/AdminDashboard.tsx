import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogOut, Users, Download, Mail, Phone, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchLeads();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin");
    }
  };

  const fetchLeads = async () => {
    console.log("Buscando leads no Supabase...");
    try {
      // Fetch contacts joined with leads
      const { data, error } = await supabase
        .from("contacts")
        .select(`
          id,
          full_name,
          email,
          phone,
          created_at,
          leads (
            status,
            initial_medium,
            initial_campaign
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro retornado pelo Supabase Query:", error);
        throw error;
      }

      console.log("Leads carregados com sucesso:", data?.length);
      setLeads(data || []);
    } catch (error: any) {
      console.error("Exceção capturada ao buscar leads:", error);
      
      let errorMessage = error.message;
      if (error.message === "Failed to fetch") {
        errorMessage = "Não foi possível conectar ao banco de dados. Verifique o arquivo .env";
      }

      toast({
        title: "Erro ao buscar leads",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse">Carregando dados dos leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Painel de Leads
            </h1>
            <p className="text-muted-foreground">
              Gerencie e visualize as pessoas interessadas na comunidade.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button 
              variant="destructive" 
              className="h-10" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
              Sair
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{leads.length}</div>
              <p className="text-xs text-primary mt-1">+100% desde o início</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Aguardando Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">
                {leads.filter(l => l.leads?.[0]?.status === 'new').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Status: Novo</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversão Landpage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">100%</div>
              <p className="text-xs text-muted-foreground mt-1">Origem: Landpage</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle>Lista de Interessados</CardTitle>
            <CardDescription>Visualização detalhada dos dados capturados.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[250px] py-4">Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Nenhum lead capturado ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium py-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">
                          {lead.full_name?.substring(0, 2).toUpperCase()}
                        </div>
                        {lead.full_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {lead.phone || "Não informado"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lead.leads?.[0]?.status === 'new' ? 'default' : 'secondary'} className="rounded-full">
                          {lead.leads?.[0]?.status || 'sem status'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
