import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { DeliveryTermsTab } from "@/components/DeliveryTermsTab";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLocation, useRoute } from "wouter";

export default function InspectionDetail() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/inspections/:id");
  const inspectionId = params?.id ? parseInt(params.id) : null;

  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    status: "pending" as "pending" | "completed" | "cancelled",
    notes: "",
  });

  const { data: inspection, isLoading, refetch } = trpc.inspections.getById.useQuery(
    { id: inspectionId! },
    { enabled: !!inspectionId }
  );

  const updateMutation = trpc.inspections.update.useMutation();

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  if (!match || !inspectionId) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Vistoria não encontrada</p>
        </div>
      </DashboardLayout>
    );
  }

  useEffect(() => {
    if (inspection) {
      setFormData({
        title: inspection.title,
        location: inspection.location || "",
        date: new Date(inspection.date).toISOString().split("T")[0],
        status: inspection.status as "pending" | "completed" | "cancelled",
        notes: inspection.notes || "",
      });
    }
  }, [inspection]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: inspectionId,
        title: formData.title,
        location: formData.location,
        date: new Date(formData.date),
        status: formData.status,
        notes: formData.notes,
      });
      toast.success("Vistoria atualizada com sucesso!");
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar vistoria");
    }
  };

  const handleStatusChange = (newStatus: "pending" | "completed" | "cancelled") => {
    setFormData((prev) => ({ ...prev, status: newStatus }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-500">Carregando vistoria...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!inspection) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Vistoria não encontrada</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/inspections")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {inspection.title}
            </h1>
            <p className="text-slate-600 mt-1">
              Detalhes da vistoria
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Detalhes
          </button>
          <button
            onClick={() => setActiveTab("deliveryTerms")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "deliveryTerms"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Termos de Entrega
          </button>
        </div>

        {/* Content */}
        {activeTab === "details" ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informações da Vistoria</CardTitle>
                  <CardDescription>
                    {isEditing ? "Edite os detalhes da vistoria" : "Visualize os detalhes da vistoria"}
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {isEditing ? (
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">
                      Título da Vistoria
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-2"
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
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status
                    </Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-md"
                    >
                      <option value="pending">Em Andamento</option>
                      <option value="completed">Concluída</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
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
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Título
                    </Label>
                    <p className="text-slate-600 mt-1">{inspection.title}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">
                        Local
                      </Label>
                      <p className="text-slate-600 mt-1">
                        {inspection.location || "Não especificado"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">
                        Data
                      </Label>
                      <p className="text-slate-600 mt-1">
                        {new Date(inspection.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Status
                    </Label>
                    <p className="text-slate-600 mt-1">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          inspection.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : inspection.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {inspection.status === "completed"
                          ? "Concluída"
                          : inspection.status === "cancelled"
                            ? "Cancelada"
                            : "Em Andamento"}
                      </span>
                    </p>
                  </div>

                  {inspection.notes && (
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">
                        Observações
                      </Label>
                      <p className="text-slate-600 mt-1">{inspection.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <DeliveryTermsTab
            inspectionId={inspectionId}
            inspectionTitle={inspection.title}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
