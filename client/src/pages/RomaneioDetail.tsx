import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Download, Printer, Edit2, Save, X } from "lucide-react";
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
  const [formData, setFormData] = useState<any>(null);

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

  const handleEditClick = () => {
    if (romaneio) {
      setFormData({ ...romaneio });
      setIsEditing(true);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      await updateMutation.mutateAsync({
        id: parseInt(id || "0"),
        title: formData.title,
        remetente: formData.remetente,
        destinatario: formData.destinatario,
        dataEmissao: new Date(formData.dataEmissao),
        observacoes: formData.observacoes || undefined,
        responsavel: formData.responsavel || undefined,
        tipoContrato: formData.tipoContrato || undefined,
        contratante: formData.contratante || undefined,
        dataInicio: formData.dataInicio ? new Date(formData.dataInicio) : undefined,
        previsaoTermino: formData.previsaoTermino ? new Date(formData.previsaoTermino) : undefined,
        numeroContrato: formData.numeroContrato || undefined,
        endereco: formData.endereco || undefined,
        valor: formData.valor || undefined,
      });

      toast.success("Romaneio atualizado com sucesso!");
      setIsEditing(false);
      romaneioQuery.refetch();
    } catch (error) {
      toast.error("Erro ao atualizar romaneio");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(null);
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

  const displayData = isEditing && formData ? formData : romaneio;

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
                {displayData.title}
              </h1>
              <p className="text-slate-600 mt-1">
                Criado em {new Date(displayData.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleEditClick}
                >
                  <Edit2 className="h-4 w-4" />
                  Editar
                </Button>
              </>
            )}
            {isEditing && (
              <>
                <Button
                  className="gap-2"
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Info Card - Informações do Romaneio */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div>
              <CardTitle>Informações do Romaneio</CardTitle>
              <CardDescription>
                Detalhes da carga e destinatário
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-slate-600 uppercase">Título</Label>
                    <p className="text-sm font-medium mt-1">{displayData.title}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-600 uppercase">Data de Emissão</Label>
                    <p className="text-sm font-medium mt-1">
                      {new Date(displayData.dataEmissao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Remetente</Label>
                  <p className="text-sm font-medium mt-1 whitespace-pre-wrap">
                    {displayData.remetente}
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Destinatário</Label>
                  <p className="text-sm font-medium mt-1 whitespace-pre-wrap">
                    {displayData.destinatario}
                  </p>
                </div>

                {displayData.observacoes && (
                  <div>
                    <Label className="text-xs font-semibold text-slate-600 uppercase">Observações</Label>
                    <p className="text-sm font-medium mt-1 whitespace-pre-wrap">
                      {displayData.observacoes}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataEmissao">Data de Emissão *</Label>
                    <Input
                      id="dataEmissao"
                      type="date"
                      value={formData.dataEmissao?.split("T")[0] || ""}
                      onChange={(e) => handleInputChange("dataEmissao", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="remetente">Remetente *</Label>
                  <Textarea
                    id="remetente"
                    value={formData.remetente}
                    onChange={(e) => handleInputChange("remetente", e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="destinatario">Destinatário *</Label>
                  <Textarea
                    id="destinatario"
                    value={formData.destinatario}
                    onChange={(e) => handleInputChange("destinatario", e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes || ""}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Detalhes da Obra */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle>Detalhes da Obra</CardTitle>
            <CardDescription>
              Informações completas do projeto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Responsável Técnico</Label>
                  <p className="text-sm font-medium mt-1">
                    {displayData.responsavel || "Não informado"}
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Tipo de Contrato</Label>
                  <p className="text-sm font-medium mt-1">
                    {displayData.tipoContrato || "Não informado"}
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Contratante</Label>
                  <p className="text-sm font-medium mt-1">
                    {displayData.contratante || "Não informado"}
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Número do Contrato</Label>
                  <p className="text-sm font-medium mt-1">
                    {displayData.numeroContrato || "Não informado"}
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Data de Início</Label>
                  <p className="text-sm font-medium mt-1">
                    {displayData.dataInicio 
                      ? new Date(displayData.dataInicio).toLocaleDateString("pt-BR")
                      : "Não informado"}
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Previsão de Término</Label>
                  <p className="text-sm font-medium mt-1">
                    {displayData.previsaoTermino
                      ? new Date(displayData.previsaoTermino).toLocaleDateString("pt-BR")
                      : "Não informado"}
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-600 uppercase">Valor do Contrato</Label>
                  <p className="text-sm font-medium mt-1 text-green-600">
                    {displayData.valor ? `R$ ${parseFloat(displayData.valor as any).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Não informado"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responsavel">Responsável Técnico</Label>
                  <Input
                    id="responsavel"
                    value={formData.responsavel || ""}
                    onChange={(e) => handleInputChange("responsavel", e.target.value)}
                    className="mt-1"
                    placeholder="Ex: Eng. João da Silva"
                  />
                </div>

                <div>
                  <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                  <Input
                    id="tipoContrato"
                    value={formData.tipoContrato || ""}
                    onChange={(e) => handleInputChange("tipoContrato", e.target.value)}
                    className="mt-1"
                    placeholder="Ex: Empreitada por Preço Global"
                  />
                </div>

                <div>
                  <Label htmlFor="contratante">Contratante</Label>
                  <Input
                    id="contratante"
                    value={formData.contratante || ""}
                    onChange={(e) => handleInputChange("contratante", e.target.value)}
                    className="mt-1"
                    placeholder="Ex: Construtora ABC Ltda"
                  />
                </div>

                <div>
                  <Label htmlFor="numeroContrato">Número do Contrato</Label>
                  <Input
                    id="numeroContrato"
                    value={formData.numeroContrato || ""}
                    onChange={(e) => handleInputChange("numeroContrato", e.target.value)}
                    className="mt-1"
                    placeholder="Ex: CT-2026-001234"
                  />
                </div>

                <div>
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={formData.dataInicio?.split("T")[0] || ""}
                    onChange={(e) => handleInputChange("dataInicio", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="previsaoTermino">Previsão de Término</Label>
                  <Input
                    id="previsaoTermino"
                    type="date"
                    value={formData.previsaoTermino?.split("T")[0] || ""}
                    onChange={(e) => handleInputChange("previsaoTermino", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="valor">Valor do Contrato</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor || ""}
                    onChange={(e) => handleInputChange("valor", e.target.value)}
                    className="mt-1"
                    placeholder="Ex: 150000.00"
                  />
                </div>
              </div>
            )}

            {!isEditing ? (
              <div>
                <Label className="text-xs font-semibold text-slate-600 uppercase">Endereço da Obra</Label>
                <p className="text-sm font-medium mt-1">
                  {displayData.endereco || "Não informado"}
                </p>
              </div>
            ) : (
              <div>
                <Label htmlFor="endereco">Endereço da Obra</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco || ""}
                  onChange={(e) => handleInputChange("endereco", e.target.value)}
                  className="mt-1"
                  rows={2}
                  placeholder="Ex: Av. Paulista, 1000 - Bloco A - São Paulo, SP"
                />
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
