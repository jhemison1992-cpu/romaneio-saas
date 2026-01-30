import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import type { SubscriptionPlan } from "@shared/types";

export default function PlanSelection() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plansQuery = trpc.subscription.listPlans.useQuery();
  const subscribeMutation = trpc.subscription.subscribe.useMutation();

  const handleSelectPlan = async (planSlug: string) => {
    if (!user) return;

    setLoading(true);
    setSelectedPlan(planSlug);

    try {
      await subscribeMutation.mutateAsync({ planSlug });
      toast.success("Plano selecionado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Erro ao selecionar plano. Tente novamente.");
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  };

  if (plansQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando planos...</p>
        </div>
      </div>
    );
  }

  const plans = plansQuery.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-slate-600">
            Selecione o plano perfeito para suas necessidades de romaneio
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan: SubscriptionPlan) => (
            <Card
              key={plan.id}
              className={`relative transition-all duration-200 cursor-pointer ${
                selectedPlan === plan.slug
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => handleSelectPlan(plan.slug)}
            >
              {plan.slug === "professional" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white">Mais Popular</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <div className="text-4xl font-bold text-slate-900">
                    R$ {parseFloat(plan.monthlyPrice).toFixed(2).replace(".", ",")}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">/mês</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-900">
                    Incluso:
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">
                        Até {plan.maxRomaneios === 999999 ? "∞" : plan.maxRomaneios} romaneios
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">
                        Até {plan.maxUsers === 999999 ? "∞" : plan.maxUsers} usuários
                      </span>
                    </li>
                    {plan.features.slice(0, 3).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600 capitalize">
                          {feature.replace(/_/g, " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={selectedPlan === plan.slug ? "default" : "outline"}
                  disabled={loading && selectedPlan === plan.slug}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.slug);
                  }}
                >
                  {loading && selectedPlan === plan.slug ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    "Selecionar"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-slate-600">
          <p className="text-sm">
            Todos os planos incluem suporte por email e acesso ao dashboard completo.
          </p>
        </div>
      </div>
    </div>
  );
}
