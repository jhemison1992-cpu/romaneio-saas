import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Trash2, Eye } from "lucide-react";

interface DeliveryTermsTabProps {
  inspectionId: number;
  inspectionTitle?: string;
}

export function DeliveryTermsTab({
  inspectionId,
  inspectionTitle,
}: DeliveryTermsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    responsibleTechnician: "",
    description: "",
  });

  const deliveryTermsQuery = trpc.deliveryTerms.getByInspection.useQuery({
    inspectionId,
  });

  const createTermMutation = trpc.deliveryTerms.create.useMutation({
    onSuccess: () => {
      deliveryTermsQuery.refetch();
      setIsDialogOpen(false);
      setFormData({ responsibleTechnician: "", description: "" });
    },
  });

  const deleteTermMutation = trpc.deliveryTerms.delete.useMutation({
    onSuccess: () => {
      deliveryTermsQuery.refetch();
    },
  });

  const handleCreateTerm = async () => {
    if (!formData.responsibleTechnician.trim()) {
      alert("Por favor, preencha o nome do responsável técnico");
      return;
    }

    try {
      await createTermMutation.mutateAsync({
        inspectionId,
        responsibleTechnician: formData.responsibleTechnician,
        description: formData.description,
        completionDate: new Date(),
      });
    } catch (error) {
      console.error("Erro ao criar termo de entrega:", error);
      alert("Erro ao criar termo de entrega");
    }
  };

  const handleDeleteTerm = async (termId: number) => {
    if (confirm("Tem certeza que deseja deletar este termo de entrega?")) {
      try {
        await deleteTermMutation.mutateAsync({ id: termId });
      } catch (error) {
        console.error("Erro ao deletar termo de entrega:", error);
        alert("Erro ao deletar termo de entrega");
      }
    }
  };

  const handleDownloadPDF = async (termId: number) => {
    try {
      const response = await fetch(
        `/api/deliveryTerms/${termId}/pdf`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao baixar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `termo-entrega-${termId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      alert("Erro ao baixar PDF");
    }
  };

  const term = deliveryTermsQuery.data;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Termos de Entrega</h3>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          Novo Termo
        </Button>
      </div>

      {term ? (
        <Card className="p-6 border border-orange-200 bg-orange-50">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Número de Protocolo
              </Label>
              <p className="text-sm text-gray-600 mt-1">{term.protocolNumber}</p>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Responsável Técnico
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                {term.responsibleTechnician}
              </p>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Data de Conclusão
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(term.completionDate).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {term.description && (
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Descrição
                </Label>
                <p className="text-sm text-gray-600 mt-1">{term.description}</p>
              </div>
            )}

            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Status
              </Label>
              <p className="text-sm mt-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    term.status === "signed"
                      ? "bg-green-100 text-green-800"
                      : term.status === "archived"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {term.status === "draft"
                    ? "Rascunho"
                    : term.status === "signed"
                      ? "Assinado"
                      : "Arquivado"}
                </span>
              </p>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => handleDownloadPDF(term.id)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar PDF
              </Button>

              <Button
                onClick={() => handleDeleteTerm(term.id)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Deletar
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum termo de entrega criado para esta vistoria</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Termo de Entrega</DialogTitle>
            <DialogDescription>
              Preencha os dados para gerar um novo termo de entrega
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="technician" className="text-sm font-semibold">
                Responsável Técnico *
              </Label>
              <Input
                id="technician"
                placeholder="Nome do responsável técnico"
                value={formData.responsibleTechnician}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    responsibleTechnician: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold">
                Descrição
              </Label>
              <Textarea
                id="description"
                placeholder="Descrição do termo de entrega (opcional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateTerm}
                disabled={createTermMutation.isPending}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {createTermMutation.isPending ? "Criando..." : "Criar Termo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
