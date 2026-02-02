import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Trash2, Edit2, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Inspections() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const { data: inspections = [], isLoading, refetch } = trpc.inspections.list.useQuery();
  const createMutation = trpc.inspections.create.useMutation();
  const deleteMutation = trpc.inspections.delete.useMutation();

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Título da vistoria é obrigatório");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        location: formData.location,
        date: new Date(formData.date),
        notes: formData.notes,
      });
      toast.success("Vistoria criada com sucesso!");
      setFormData({
        title: "",
        location: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Erro ao criar vistoria. Tente novamente.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta vistoria?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Vistoria deletada com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao deletar vistoria.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-orange-100 text-orange-800 border-orange-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluída";
      case "cancelled":
        return "Cancelada";
      default:
        return "Em Andamento";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Vistorias
            </h1>
            <p className="text-slate-600 mt-1">
              Gerencie as visitas de liberação de ambientes
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Vistoria
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Nova Vistoria</CardTitle>
              <CardDescription>
                Crie uma nova vistoria para acompanhar o progresso da obra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Título da Vistoria *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: ALUMINC Vistorias de Instalações - Obra DUBAI LM"
                    className="mt-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium">
                      Local
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Ex: Bloco A - Pavimento 3"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">
                      Data da Vistoria
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Observações
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Descreva os detalhes da vistoria..."
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    Salvar Vistoria
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Cards Grid */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-slate-500">Carregando vistorias...</p>
              </CardContent>
            </Card>
          ) : inspections.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Nenhuma vistoria criada ainda</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Crie sua primeira vistoria para começar a acompanhar o progresso
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inspections.map((inspection) => (
                <Card key={inspection.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">
                          {inspection.title}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(inspection.date).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Location */}
                    {inspection.location && (
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase">Local</p>
                        <p className="text-sm text-slate-700">{inspection.location}</p>
                      </div>
                    )}

                    {/* Status */}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                      <div className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(inspection.status)}`}>
                        {getStatusLabel(inspection.status)}
                      </div>
                    </div>

                    {/* Notes Preview */}
                    {inspection.notes && (
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase">Observações</p>
                        <p className="text-sm text-slate-600 line-clamp-2">{inspection.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => navigate(`/inspections/${inspection.id}`)}
                      >
                        <Edit2 className="h-4 w-4" />
                        Abrir Vistoria
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(inspection.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
