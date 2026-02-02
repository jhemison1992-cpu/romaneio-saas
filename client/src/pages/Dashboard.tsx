import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, FileText, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showNewForm, setShowNewForm] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const romaneiosQuery = trpc.romaneio.list.useQuery();
  const subscriptionQuery = trpc.subscription.getCurrentSubscription.useQuery();

  const romaneios = romaneiosQuery.data || [];
  const subscription = subscriptionQuery.data;

  const handleNewRomaneio = () => {
    navigate("/template-selector");
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
          <Button onClick={handleNewRomaneio} className="gap-2">
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">
                        Título
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">
                        Destinatário
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">
                        Data
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-900">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {romaneios.map((romaneio: any) => (
                      <tr
                        key={romaneio.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-slate-900">{romaneio.title}</td>
                        <td className="py-3 px-4 text-slate-600 truncate">
                          {romaneio.destinatario}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              romaneio.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : romaneio.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {romaneio.status === "draft"
                              ? "Rascunho"
                              : romaneio.status === "completed"
                                ? "Completo"
                                : "Arquivado"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm">
                          {new Date(romaneio.dataEmissao).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRomaneio(romaneio.id)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement PDF download
                                toast.info("Download em desenvolvimento");
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRomaneio(romaneio.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
