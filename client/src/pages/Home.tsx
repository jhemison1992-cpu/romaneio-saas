import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, FileText, BarChart3, Shield } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">Romaneio SaaS</span>
          </div>
          <Button asChild>
            <a href={getLoginUrl()}>Fazer Login</a>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Gestão de Romaneios Simplificada
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              A plataforma mais elegante e profissional para gerenciar seus romaneios de carga. Crie, organize e exporte documentos com facilidade.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="gap-2">
                <a href={getLoginUrl()}>
                  Começar Agora
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/pricing">Ver Preços</a>
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-8 border border-slate-700">
            <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
              <FileText className="h-24 w-24 text-slate-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Recursos Principais</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <FileText className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Romaneios Profissionais</h3>
            <p className="text-slate-400">Crie romaneios com layout elegante e profissional em segundos</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <BarChart3 className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Relatórios Avançados</h3>
            <p className="text-slate-400">Gere relatórios detalhados e exporte em PDF com um clique</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <Shield className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Segurança Garantida</h3>
            <p className="text-slate-400">Seus dados protegidos com criptografia de nível empresarial</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Escolha seu plano e comece a gerenciar seus romaneios com elegância e profissionalismo.
        </p>
        <Button asChild size="lg" className="gap-2">
          <a href={getLoginUrl()}>
            Fazer Login
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </section>
    </div>
  );
}
