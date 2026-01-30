import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RomaneioDetail() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { id } = useParams<{ id?: string }>();
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  if (!id) {
    navigate("/dashboard");
    return null;
  }

  const romaneioQuery = trpc.romaneio.get.useQuery({ id: parseInt(id || "0") });
  const updateMutation = trpc.romaneio.update.useMutation();

  const romaneio = romaneioQuery.data;

  const handleSave = async () => {
    if (!romaneio) return;

    try {
      await updateMutation.mutateAsync({
        id: parseInt(id || "0"),
        title: romaneio.title,
        remetente: romaneio.remetente,
        destinatario: romaneio.destinatario,
        dataEmissao: new Date(romaneio.dataEmissao),
        observacoes: romaneio.observacoes || undefined,
      });

      toast.success("Romaneio atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao atualizar romaneio");
    }
  };

  if (romaneioQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando romaneio...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!romaneio) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Romaneio não encontrado</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {romaneio.title}
              </h1>
              <p className="text-slate-600 mt-1">
                Criado em {new Date(romaneio.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Informações do Romaneio</CardTitle>
              <CardDescription>
                Detalhes da carga e destinatário
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-600">Título</Label>
                <p className="text-sm font-medium mt-1">{romaneio.title}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Data de Emissão</Label>
                <p className="text-sm font-medium mt-1">
                  {new Date(romaneio.dataEmissao).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-600">Remetente</Label>
              <p className="text-sm font-medium mt-1 whitespace-pre-wrap">
                {romaneio.remetente}
              </p>
            </div>

            <div>
              <Label className="text-xs text-slate-600">Destinatário</Label>
              <p className="text-sm font-medium mt-1 whitespace-pre-wrap">
                {romaneio.destinatario}
              </p>
            </div>

            {romaneio.observacoes && (
              <div>
                <Label className="text-xs text-slate-600">Observações</Label>
                <p className="text-sm font-medium mt-1 whitespace-pre-wrap">
                  {romaneio.observacoes}
                </p>
              </div>
            )}

            {isEditing && (
              <div className="pt-4 border-t space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={romaneio.title}
                    onChange={(e) => {
                      // Update logic would go here
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={updateMutation.isPending}>
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Itens da Carga</CardTitle>
            <CardDescription>
              {romaneio.items?.length || 0} item{(romaneio.items?.length || 0) !== 1 ? "ns" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {romaneio.items && romaneio.items.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Peso</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {romaneio.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell className="text-right">
                          {item.quantidade}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.peso} {item.unidade}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.valor ? `R$ ${item.valor}` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum item adicionado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
