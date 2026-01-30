import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Zap, Star, Crown } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

const plans = [
  {
    id: "free",
    name: "Gratuito",
    description: "Perfeito para começar",
    price: "R$ 0",
    period: "/mês",
    icon: <Zap className="h-6 w-6 text-blue-500" />,
    features: [
      "Até 5 romaneios por mês",
      "Visualização básica",
      "Suporte por email",
      "Sem limite de usuários",
      "Exportação em PDF",
    ],
    notIncluded: [
      "Relatórios avançados",
      "Integração com sistemas",
      "Suporte prioritário",
      "Templates customizados",
    ],
    cta: "Começar Agora",
    highlighted: false,
  },
  {
    id: "starter",
    name: "Iniciante",
    description: "Para pequenas operações",
    price: "R$ 49",
    period: "/mês",
    icon: <Star className="h-6 w-6 text-amber-500" />,
    features: [
      "Até 50 romaneios por mês",
      "Dashboard completo",
      "Suporte por email e chat",
      "Até 5 usuários",
      "Exportação em PDF",
      "Histórico de 6 meses",
      "Filtros e busca avançada",
    ],
    notIncluded: [
      "Relatórios avançados",
      "Integração com sistemas",
      "Suporte prioritário",
    ],
    cta: "Escolher Plano",
    highlighted: true,
  },
  {
    id: "professional",
    name: "Profissional",
    description: "Para operações médias",
    price: "R$ 149",
    period: "/mês",
    icon: <Crown className="h-6 w-6 text-purple-500" />,
    features: [
      "Romaneios ilimitados",
      "Dashboard completo",
      "Suporte por email, chat e telefone",
      "Até 20 usuários",
      "Exportação em PDF e Excel",
      "Histórico completo",
      "Filtros e busca avançada",
      "Relatórios básicos",
      "Templates customizados",
    ],
    notIncluded: [
      "Integração com sistemas",
      "Suporte 24/7",
    ],
    cta: "Escolher Plano",
    highlighted: false,
  },
  {
    id: "enterprise",
    name: "Empresarial",
    description: "Para grandes operações",
    price: "Sob consulta",
    period: "",
    icon: <Crown className="h-6 w-6 text-indigo-600" />,
    features: [
      "Tudo do plano Profissional",
      "Suporte 24/7 dedicado",
      "Integração com sistemas",
      "Usuários ilimitados",
      "Relatórios avançados",
      "API customizada",
      "SLA garantido",
      "Treinamento personalizado",
      "Backup automático",
    ],
    notIncluded: [],
    cta: "Solicitar Orçamento",
    highlighted: false,
  },
];

export default function PricingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Planos para Gestão de Obras
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Escolha o plano perfeito para gerenciar suas obras e romaneios. Sem taxas ocultas, cancele a qualquer momento.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <a href={getLoginUrl()}>
                Começar Teste Gratuito
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative transition-all duration-300 ${
                plan.highlighted ? "lg:scale-105 lg:-translate-y-4" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}
              <Card
                className={`h-full flex flex-col ${
                  plan.highlighted
                    ? "border-2 border-blue-500 shadow-2xl"
                    : "border border-slate-200"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div>{plan.icon}</div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-slate-600">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.length > 0 && (
                      <>
                        {plan.notIncluded.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 opacity-50">
                            <div className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-500 line-through">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className={`w-full gap-2 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    <a href={getLoginUrl()}>
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Posso trocar de plano a qualquer momento?
              </h3>
              <p className="text-slate-600">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Há algum contrato de longo prazo?
              </h3>
              <p className="text-slate-600">
                Não. Todos os planos são mensais e você pode cancelar a qualquer momento, sem penalidades.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Posso testar gratuitamente?
              </h3>
              <p className="text-slate-600">
                Sim! O plano Gratuito oferece 5 romaneios por mês para você testar todas as funcionalidades básicas.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Qual é a política de reembolso?
              </h3>
              <p className="text-slate-600">
                Oferecemos reembolso total em até 30 dias se não estiver satisfeito com o serviço.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Comece Agora</h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a centenas de empresas que já confiam na Gestão de Obras
          </p>
          <Button asChild size="lg" className="gap-2 bg-white text-blue-600 hover:bg-blue-50">
            <a href={getLoginUrl()}>
              Criar Conta Gratuita
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
