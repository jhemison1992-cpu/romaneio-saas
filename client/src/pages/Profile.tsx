import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import { User, Mail, CreditCard } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const subscriptionQuery = trpc.subscription.getCurrentSubscription.useQuery();
  const subscription = subscriptionQuery.data;

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meu Perfil</h1>
          <p className="text-slate-600 mt-1">
            Gerencie suas informações de perfil e plano
          </p>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Seus dados de conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-600">Nome</Label>
                <p className="text-sm font-medium mt-2">{user?.name || "Não informado"}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Email</Label>
                <p className="text-sm font-medium mt-2">{user?.email || "Não informado"}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-600">Método de Login</Label>
              <p className="text-sm font-medium mt-2">{user?.loginMethod || "Não informado"}</p>
            </div>
            <Button variant="outline" className="w-full">
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plano de Assinatura
            </CardTitle>
            <CardDescription>
              Seu plano atual e informações de cobrança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-600">Plano Ativo</Label>
                    <p className="text-sm font-medium mt-2">
                      {subscription.planId}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">Status</Label>
                    <p className="text-sm font-medium mt-2 capitalize">
                      {subscription.status === "active" ? "Ativo" : subscription.status}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">Data de Início</Label>
                    <p className="text-sm font-medium mt-2">
                      {new Date(subscription.startDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">Data de Vencimento</Label>
                    <p className="text-sm font-medium mt-2">
                      {subscription.endDate
                        ? new Date(subscription.endDate).toLocaleDateString("pt-BR")
                        : "Sem data"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline">Mudar Plano</Button>
                  <Button variant="outline">Cancelar Assinatura</Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Você ainda não possui um plano ativo
                </p>
                <Button>Escolher Plano</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Conta</CardTitle>
            <CardDescription>
              Gerenciar configurações e preferências
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Notificações por Email</Label>
              <p className="text-xs text-slate-600 mb-2">
                Receba notificações sobre suas atividades
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Novos romaneios criados</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Romaneios completados</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Alertas de limite de plano</span>
                </label>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Salvar Preferências
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
