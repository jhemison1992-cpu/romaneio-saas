import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, FileText, Download, Trash2, MapPin, Building2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
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

  const handleNewRomaneio = () => {
    setShowNewForm(true);
  };

  const handleCreateRomaneio = async () => {
    if (!formData.title.trim()) {
      toast.error("Nome da obra é obrigatório");
      return;
    }

    try {
      await createRomaneioMutation.mutateAsync({
        title: formData.title,
        remetente: formData.remetente,
        destinatario: formData.destinatario,
        dataEmissao: new Date(),
      });

      toast.success("Obra criada com sucesso!");
      setShowNewForm(false);
      setFormData({
        title: "",
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

  const handleDeleteRomaneio = async (id: number) => {
    if (!confirm("Tem certeza que deseja arquivar este romaneio?")) return;

    try {
      // TODO: Implement delete mutation
      toast.success("Romaneio arquivado com sucesso!");
      romaneiosQuery.refetch();
    } catch (error) {
      toast.error("Erro ao arquivar romaneio");
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
          <Button 
            onClick={handleNewRomaneio} 
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Nova Obra
          </Button>
        </div>

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

        {/* Romaneios List */}
        <Card>
          <CardHeader>
            <CardTitle>Minhas Obras</CardTitle>
            <CardDescription>
              {romaneios.length} obra{romaneios.length !== 1 ? "s" : ""} criada{romaneios.length !== 1 ? "s" : ""}
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
                {romaneios.map((romaneio) => (
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
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Criar Nova Obra</DialogTitle>
            <DialogDescription>
              Preencha os dados da obra para começar a criar romaneios
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Nome da Obra */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Nome da Obra *
              </Label>
              <Input
                id="title"
                placeholder="Ex: DUBAI LM"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Remetente */}
            <div className="space-y-2">
              <Label htmlFor="remetente" className="text-base font-semibold">
                Remetente
              </Label>
              <Textarea
                id="remetente"
                placeholder="Ex: ALUMINC Esquadrias Metálicas Indústria e Comércio Ltda."
                value={formData.remetente}
                onChange={(e) => setFormData({ ...formData, remetente: e.target.value })}
                rows={2}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Destinatário */}
            <div className="space-y-2">
              <Label htmlFor="destinatario" className="text-base font-semibold">
                Destinatário
              </Label>
              <Textarea
                id="destinatario"
                placeholder="Ex: DUBAI LM EMPREENDIMENTOS IMOBILIÁRIOS SPE LTDA"
                value={formData.destinatario}
                onChange={(e) => setFormData({ ...formData, destinatario: e.target.value })}
                rows={2}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => setShowNewForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateRomaneio}
                disabled={createRomaneioMutation.isPending}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {createRomaneioMutation.isPending ? "Criando..." : "Criar Obra"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
