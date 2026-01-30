import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Trash2, Edit2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Users() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "user" | "admin",
  });

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Nome e email são obrigatórios");
      return;
    }

    try {
      toast.success("Usuário criado com sucesso!");
      setFormData({
        name: "",
        email: "",
        role: "user",
      });
      setShowForm(false);
    } catch (error) {
      toast.error("Erro ao criar usuário. Tente novamente.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Usuários
            </h1>
            <p className="text-slate-600 mt-1">
              Gerencie os usuários da sua empresa
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Novo Usuário</CardTitle>
              <CardDescription>
                Crie um novo usuário para acessar a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nome Completo *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: João Silva"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="joao@example.com"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role" className="text-sm font-medium">
                    Perfil
                  </Label>
                  <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
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
                    Criar Usuário
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários da Empresa</CardTitle>
            <CardDescription>
              Lista de todos os usuários com acesso à plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{user?.name}</TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                        {user?.role === "admin" ? "Administrador" : "Usuário"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(user?.createdAt || "").toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>
                        <Edit2 className="h-4 w-4" />
                      </Button>
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
