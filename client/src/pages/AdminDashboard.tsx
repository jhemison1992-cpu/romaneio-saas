import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, Users, FileText, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (!isAuthenticated || user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard Administrativo
          </h1>
          <p className="text-slate-600 mt-1">
            Gerencie usuários, planos e estatísticas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Usuários Totais</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">0</p>
                </div>
                <Users className="h-8 w-8 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Romaneios Criados</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">0</p>
                </div>
                <FileText className="h-8 w-8 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Receita Mensal</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">R$ 0</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Planos Ativos</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">0</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gerenciar Usuários
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Funcionalidades disponíveis:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-slate-300 rounded-full"></span>
                    Ver lista de usuários
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-slate-300 rounded-full"></span>
                    Visualizar detalhes do usuário
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-slate-300 rounded-full"></span>
                    Gerenciar permissões
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-slate-300 rounded-full"></span>
                    Desativar/ativar usuários
                  </li>
                </ul>
                <Button className="w-full mt-4">Gerenciar Usuários</Button>
              </div>
            </CardContent>
          </Card>

          {/* Plans Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Gerenciar Planos
              </CardTitle>
              <CardDescription>
                Configure e gerencie os planos de assinatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Funcionalidades disponíveis:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-slate-300 rounded-full"></span>
                    Ver planos disponíveis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-slate-300 rounded-full"></span>
                    Criar novos planos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-slate-300 rounded-full"></span>
                    Editar preços e features
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-slate-300 rounded-full"></span>
                    Ativar/desativar planos
                  </li>
                </ul>
                <Button className="w-full mt-4">Gerenciar Planos</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhuma atividade registrada
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
