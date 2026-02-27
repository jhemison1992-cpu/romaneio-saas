import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import StatsOverview from "@/components/StatsOverview";
import { Plus, FileText, Download, Trash2, Building2, Users, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showNewForm, setShowNewForm] = useState(false);
  const [cadastroType, setCadastroType] = useState("completo");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recent");
  const [formData, setFormData] = useState({
    title: "",
    responsavel: "",
    tipoContrato: "contratante",
    contratante: "",
    dataInicio: "",
    previsaoTermino: "",
    numeroContrato: "",
    status: "em-andamento",
    endereco: "",
    listaTarefas: false,
    remetente: "",
    destinatario: "",
  });

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const romaneiosQuery = trpc.romaneio.list.useQuery();
  const subscriptionQuery = trpc.subscription.getCurrentSubscription.useQuery();
  const createRomaneioMutation = trpc.romaneio.create.useMutation();

  const romaneios = romaneiosQuery.data || [];
  const subscription = subscriptionQuery.data;

  const filteredRomaneios = romaneios
    .filter((r: any) => {
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.remetente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.destinatario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.responsavel?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "recent") {
        return new Date(b.dataEmissao).getTime() - new Date(a.dataEmissao).getTime();
      } else if (sortBy === "valor-alto") {
        return (parseFloat(b.valor as any) || 0) - (parseFloat(a.valor as any) || 0);
      } else if (sortBy === "valor-baixo") {
        return (parseFloat(a.valor as any) || 0) - (parseFloat(b.valor as any) || 0);
      }
      return 0;
    });

  const handleNewRomaneio = () => {
    setShowNewForm(true);
    setCadastroType("completo");
    setFormData({
      title: "",
      responsavel: "",
      tipoContrato: "contratante",
      contratante: "",
      dataInicio: "",
      previsaoTermino: "",
      numeroContrato: "",
      status: "em-andamento",
      endereco: "",
      listaTarefas: false,
      remetente: "",
      destinatario: "",
    });
  };

  const handleCreateRomaneio = async () => {
    if (!formData.title.trim()) {
      toast.error("Nome da obra é obrigatório");
      return;
    }

    try {
      await createRomaneioMutation.mutateAsync({
        title: formData.title,
        remetente: formData.responsavel || formData.remetente,
        destinatario: formData.contratante || formData.destinatario,
        dataEmissao: new Date(),
      });

      toast.success("Obra criada com sucesso!");
      setShowNewForm(false);
      setFormData({
        title: "",
        responsavel: "",
        tipoContrato: "contratante",
        contratante: "",
        dataInicio: "",
        previsaoTermino: "",
        numeroContrato: "",
        status: "em-andamento",
        endereco: "",
        listaTarefas: false,
        remetente: "",
        destinatario: "",
      });
      romaneiosQuery.refetch();
    } catch (error) {
      toast.error("Erro ao criar obra");
    }
  };

  const handleViewRomaneio = (id: number) => {
    navigate(`/romaneio/${id}`);
  };

  const deleteRomaneioMutation = trpc.romaneio.delete.useMutation();

  const handleDeleteRomaneio = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este romaneio? Esta ação não pode ser desfeita.")) return;

    try {
      await deleteRomaneioMutation.mutateAsync({ id });
      toast.success("Romaneio deletado com sucesso!");
      romaneiosQuery.refetch();
    } catch (error) {
      toast.error("Erro ao deletar romaneio");
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Minhas Obras</h1>
            <p className="text-slate-600 mt-1">
              Gerencie seus romaneios e obras
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => navigate('/dashboard/advanced')} 
              variant="outline"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Dashboard Avançado
            </Button>
            <Button 
              onClick={() => navigate('/alerts')} 
              variant="outline"
              className="gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Alertas
            </Button>
            <Button 
              onClick={handleNewRomaneio} 
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Nova Obra
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview 
          stats={{
            total: romaneios.length,
            emAndamento: romaneios.filter((r: any) => r.status === 'em-andamento').length,
            concluidas: romaneios.filter((r: any) => r.status === 'completed').length,
            atrasadas: 0,
          }}
        />

        {/* Subscription Info */}
        {subscription && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Plano Ativo</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {subscription.planId}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Fazer Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros e Busca */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Buscar</Label>
                  <Input
                    placeholder="Buscar por título, remetente, destinatário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Status</Label>
                  <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Ordenar por</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mais Recentes</SelectItem>
                      <SelectItem value="valor-alto">Maior Valor</SelectItem>
                      <SelectItem value="valor-baixo">Menor Valor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

                {/* Romaneios List */}
        <Card>
          <CardHeader>
            <CardTitle>Minhas Obras</CardTitle>
            <CardDescription>
              {filteredRomaneios.length} de {romaneios.length} obra{romaneios.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {romaneios.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">Nenhuma obra criada ainda</p>
                <Button onClick={handleNewRomaneio} variant="outline">
                  Criar Primeira Obra
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRomaneios.map((romaneio: any) => (
                  <div
                    key={romaneio.id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-100 hover:border-blue-200"
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                          {romaneio.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {new Date(romaneio.dataEmissao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      {romaneio.remetente && (
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-indigo-600" />
                          <span className="line-clamp-1">Remetente: {romaneio.remetente}</span>
                        </div>
                      )}

                      {romaneio.destinatario && (
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <Users className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-600" />
                          <span className="line-clamp-1">Destinatário: {romaneio.destinatario}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t border-slate-100">
                        <Button
                          onClick={() => handleViewRomaneio(romaneio.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Abrir
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteRomaneio(romaneio.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Criar Nova Obra */}
      <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl text-orange-600">Adicionar obra</DialogTitle>
            <button
              onClick={() => setShowNewForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>

          {/* Tabs para Cadastro Completo e Simples */}
          <Tabs value={cadastroType} onValueChange={setCadastroType} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="completo" className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-current" />
                Cadastro completo
              </TabsTrigger>
              <TabsTrigger value="simples" className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-current" />
                Cadastro simples
              </TabsTrigger>
            </TabsList>

            {/* Cadastro Completo */}
            <TabsContent value="completo" className="space-y-4">
              {/* Nome da Obra */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Nome *
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Shopping Santa Luzia"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Responsável e Tipo de Contrato */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavel" className="text-sm font-semibold">
                    Responsável
                  </Label>
                  <Input
                    id="responsavel"
                    placeholder="Ex: Eng. Carlos Silva"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoContrato" className="text-sm font-semibold">
                    Tipo de contrato
                  </Label>
                  <Select value={formData.tipoContrato} onValueChange={(value) => setFormData({ ...formData, tipoContrato: value })}>
                    <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contratante">Contratante</SelectItem>
                      <SelectItem value="fornecedor">Fornecedor</SelectItem>
                      <SelectItem value="empreitada">Empreitada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contratante */}
              <div className="space-y-2">
                <Label htmlFor="contratante" className="text-sm font-semibold">
                  Contratante
                </Label>
                <Input
                  id="contratante"
                  placeholder="Ex: Prefeitura"
                  value={formData.contratante}
                  onChange={(e) => setFormData({ ...formData, contratante: e.target.value })}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Data Início e Previsão de Término */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio" className="text-sm font-semibold">
                    Data início *
                  </Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previsaoTermino" className="text-sm font-semibold">
                    Previsão de término *
                  </Label>
                  <Input
                    id="previsaoTermino"
                    type="date"
                    value={formData.previsaoTermino}
                    onChange={(e) => setFormData({ ...formData, previsaoTermino: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Nº do Contrato e Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroContrato" className="text-sm font-semibold">
                    Nº do contrato
                  </Label>
                  <Input
                    id="numeroContrato"
                    placeholder="Ex: 2024/001"
                    value={formData.numeroContrato}
                    onChange={(e) => setFormData({ ...formData, numeroContrato: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold">
                    Status
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em-andamento">Em andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="pausada">Pausada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-sm font-semibold">
                  Endereço
                </Label>
                <Input
                  id="endereco"
                  placeholder="Ex: Av. ABC, 100, Centro"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Configurações */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <p className="text-sm font-semibold text-slate-900">Configurações</p>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="listaTarefas"
                    checked={formData.listaTarefas}
                    onCheckedChange={(checked) => setFormData({ ...formData, listaTarefas: checked as boolean })}
                  />
                  <Label htmlFor="listaTarefas" className="text-sm font-normal cursor-pointer">
                    Lista de tarefas
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Cadastro Simples */}
            <TabsContent value="simples" className="space-y-4">
              {/* Nome da Obra */}
              <div className="space-y-2">
                <Label htmlFor="titleSimples" className="text-sm font-semibold">
                  Nome *
                </Label>
                <Input
                  id="titleSimples"
                  placeholder="Ex: Shopping Santa Luzia"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Responsável */}
              <div className="space-y-2">
                <Label htmlFor="responsavelSimples" className="text-sm font-semibold">
                  Responsável
                </Label>
                <Input
                  id="responsavelSimples"
                  placeholder="Ex: Eng. Carlos Silva"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="statusSimples" className="text-sm font-semibold">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="em-andamento">Em andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="pausada">Pausada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => setShowNewForm(false)}
              className="px-6"
            >
              Fechar
            </Button>
            <Button
              onClick={handleCreateRomaneio}
              disabled={createRomaneioMutation.isPending}
              className="px-6 bg-green-600 hover:bg-green-700 text-white"
            >
              {createRomaneioMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
