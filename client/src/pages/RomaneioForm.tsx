import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RomaneioForm() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    remetente: "",
    destinatario: "",
    dataEmissao: new Date().toISOString().split("T")[0],
    observacoes: "",
  });

  const [items, setItems] = useState<
    Array<{
      id?: number;
      descricao: string;
      quantidade: number;
      peso: string;
      unidade: string;
      valor: string;
    }>
  >([]);

  const [newItem, setNewItem] = useState({
    descricao: "",
    quantidade: 1,
    peso: "",
    unidade: "kg",
    valor: "",
  });

  const createMutation = trpc.romaneio.create.useMutation();

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "quantidade" ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddItem = () => {
    if (!newItem.descricao || newItem.quantidade <= 0) {
      toast.error("Preencha a descrição e quantidade do item");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        ...newItem,
        id: Date.now(),
      },
    ]);

    setNewItem({
      descricao: "",
      quantidade: 1,
      peso: "",
      unidade: "kg",
      valor: "",
    });

    toast.success("Item adicionado");
  };

  const handleRemoveItem = (id: number | undefined) => {
    if (id === undefined) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.remetente || !formData.destinatario) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (items.length === 0) {
      toast.error("Adicione pelo menos um item ao romaneio");
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        title: formData.title,
        remetente: formData.remetente,
        destinatario: formData.destinatario,
        dataEmissao: new Date(formData.dataEmissao),
        observacoes: formData.observacoes,
      });

      toast.success("Romaneio criado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Erro ao criar romaneio");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
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
              Novo Romaneio
            </h1>
            <p className="text-slate-600 mt-1">
              Crie um novo romaneio de carga
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Preencha os dados principais do romaneio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Romaneio *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Entrega São Paulo - 2024"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataEmissao">Data de Emissão *</Label>
                  <Input
                    id="dataEmissao"
                    name="dataEmissao"
                    type="date"
                    value={formData.dataEmissao}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="remetente">Remetente *</Label>
                <Textarea
                  id="remetente"
                  name="remetente"
                  value={formData.remetente}
                  onChange={handleInputChange}
                  placeholder="Nome, endereço e contato do remetente"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="destinatario">Destinatário *</Label>
                <Textarea
                  id="destinatario"
                  name="destinatario"
                  value={formData.destinatario}
                  onChange={handleInputChange}
                  placeholder="Nome, endereço e contato do destinatário"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Observações adicionais sobre o romaneio"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Itens da Carga</CardTitle>
              <CardDescription>
                Adicione os produtos que serão transportados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Item Form */}
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="descricao">Descrição do Item</Label>
                  <Input
                    id="descricao"
                    name="descricao"
                    value={newItem.descricao}
                    onChange={handleItemChange}
                    placeholder="Ex: Caixas de eletrônicos"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      name="quantidade"
                      type="number"
                      min="1"
                      value={newItem.quantidade}
                      onChange={handleItemChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="peso">Peso</Label>
                    <Input
                      id="peso"
                      name="peso"
                      value={newItem.peso}
                      onChange={handleItemChange}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="unidade">Unidade</Label>
                    <select
                      id="unidade"
                      name="unidade"
                      value={newItem.unidade}
                      onChange={handleItemChange}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="un">un</option>
                      <option value="m">m</option>
                      <option value="m2">m²</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input
                      id="valor"
                      name="valor"
                      value={newItem.valor}
                      onChange={handleItemChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleAddItem}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>

              {/* Items List */}
              {items.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Peso</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
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
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando...
                </>
              ) : (
                "Criar Romaneio"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
