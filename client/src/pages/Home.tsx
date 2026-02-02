import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, FileText, Zap, Shield, Users, TrendingUp, CheckCircle } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-blue-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-2">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gestão de Obras
            </span>
          </div>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <a href={getLoginUrl()}>Fazer Login</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                ✨ Solução Moderna para Gestão de Obras
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Gestão <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Simplificada</span> de Obras
              </h1>
              <p className="text-xl text-slate-600">
                A plataforma mais elegante e profissional para gerenciar seus romaneios, vistorias e obras. Crie, organize e exporte documentos com facilidade.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2">
                <a href={getLoginUrl()}>
                  Começar Agora
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-slate-300 hover:border-blue-600">
                <a href="/pricing">Ver Preços</a>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
              <div className="space-y-4">
                <div className="h-3 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full w-1/2"></div>
                <div className="pt-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Recursos Poderosos</h2>
          <p className="text-xl text-slate-600">Tudo que você precisa para gerenciar obras profissionalmente</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FileText,
              title: "Romaneios Inteligentes",
              description: "Crie e gerencie romaneios com templates pré-configurados. Suporte a versão em branco ou Aluminc.",
              gradient: "from-blue-500 to-blue-600",
            },
            {
              icon: Zap,
              title: "Vistorias Rápidas",
              description: "Registre vistorias de liberação de ambientes com status em tempo real e histórico completo.",
              gradient: "from-indigo-500 to-indigo-600",
            },
            {
              icon: Shield,
              title: "Segurança Garantida",
              description: "Autenticação segura, dados criptografados e backup automático na nuvem.",
              gradient: "from-purple-500 to-purple-600",
            },
            {
              icon: Users,
              title: "Gestão de Usuários",
              description: "Convide membros da equipe e controle permissões de acesso facilmente.",
              gradient: "from-pink-500 to-pink-600",
            },
            {
              icon: TrendingUp,
              title: "Relatórios Avançados",
              description: "Gere relatórios detalhados e exporte em PDF com layout profissional.",
              gradient: "from-green-500 to-green-600",
            },
            {
              icon: CheckCircle,
              title: "Suporte Premium",
              description: "Atendimento dedicado e suporte técnico disponível 24/7 para sua tranquilidade.",
              gradient: "from-orange-500 to-orange-600",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-slate-100 hover:border-blue-200"
              >
                <div className={`bg-gradient-to-br ${feature.gradient} rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Planos Simples e Transparentes</h2>
          <p className="text-xl text-slate-600">Escolha o plano perfeito para sua empresa</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: "R$ 79,90",
              period: "/mês",
              description: "Perfeito para pequenos projetos",
              features: ["Até 50 romaneios", "Até 3 usuários", "Suporte por email", "Exportação em PDF"],
              gradient: "from-blue-500 to-blue-600",
            },
            {
              name: "Profissional",
              price: "R$ 159,80",
              period: "/mês",
              description: "Para empresas em crescimento",
              features: ["Romaneios ilimitados", "Até 10 usuários", "Suporte prioritário", "API access", "Relatórios avançados"],
              gradient: "from-indigo-500 to-indigo-600",
              highlighted: true,
            },
            {
              name: "Enterprise",
              price: "Sob consulta",
              period: "",
              description: "Para grandes operações",
              features: ["Tudo do Profissional", "Usuários ilimitados", "Suporte dedicado", "Customizações", "SLA garantido"],
              gradient: "from-purple-500 to-purple-600",
            },
          ].map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? `bg-gradient-to-br ${plan.gradient} text-white shadow-2xl scale-105`
                  : "bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={plan.highlighted ? "text-blue-100 mb-6" : "text-slate-600 mb-6"}>{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={plan.highlighted ? "text-blue-100" : "text-slate-600"}>{plan.period}</span>
              </div>
              <Button
                asChild
                className={`w-full mb-8 ${
                  plan.highlighted
                    ? "bg-white text-indigo-600 hover:bg-blue-50"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                }`}
              >
                <a href={getLoginUrl()}>Começar Agora</a>
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className={`h-5 w-5 ${plan.highlighted ? "text-blue-100" : "text-green-500"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se a centenas de empresas que confiam em nossa plataforma
          </p>
          <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-blue-50 gap-2">
            <a href={getLoginUrl()}>
              Criar Conta Grátis
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-2">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-slate-900">Gestão de Obras</span>
              </div>
              <p className="text-slate-600 text-sm">A plataforma moderna para gestão de obras e romaneios.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="/pricing" className="hover:text-blue-600">Preços</a></li>
                <li><a href="#" className="hover:text-blue-600">Recursos</a></li>
                <li><a href="#" className="hover:text-blue-600">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Sobre</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Privacidade</a></li>
                <li><a href="#" className="hover:text-blue-600">Termos</a></li>
                <li><a href="#" className="hover:text-blue-600">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-slate-600 text-sm">
            <p>&copy; 2026 Gestão de Obras. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
