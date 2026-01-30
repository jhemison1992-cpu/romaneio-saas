import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus } from "lucide-react";
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

export default function Inspections() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    status: "pending" as "pending" | "completed",
    notes: "",
  });

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
      toast.success("Vistoria criada com sucesso!");
      setFormData({
        title: "",
        location: "",
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        notes: "",
      });
      setShowForm(false);
    } catch (error) {
      toast.error("Erro ao criar vistoria. Tente novamente.");
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
              Gerencie as vistorias das suas obras
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
          <Card>
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
                    placeholder="Ex: Vistoria de Fundação"
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
                    rows={4}
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
                  <Button type="submit">
                    Salvar Vistoria
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Minhas Vistorias</CardTitle>
            <CardDescription>
              Lista de todas as vistorias realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhuma vistoria criada ainda
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
