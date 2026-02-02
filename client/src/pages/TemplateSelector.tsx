import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle2, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function TemplateSelector() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const templates = [
    {
      id: "blank",
      name: "Versão em Branco",
      description: "Crie um romaneio do zero com todos os campos vazios",
      features: [
        "Campos completamente vazios",
        "Total liberdade de preenchimento",
        "Ideal para novos projetos",
        "Sem dados pré-configurados",
      ],
      icon: FileText,
      color: "bg-blue-50 border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "aluminc",
      name: "Template Aluminc",
      description: "Use o template pré-configurado da Aluminc com dados padrão",
      features: [
        "Dados pré-preenchidos da empresa",
        "Contratante configurado",
        "Responsável técnico definido",
        "Acelera o processo de criação",
      ],
      icon: CheckCircle2,
      color: "bg-purple-50 border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Escolha um Template
          </h1>
          <p className="text-slate-600 mt-1">
            Selecione como você deseja criar seu romaneio
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <Card key={template.id} className={`border-2 ${template.color}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8 text-slate-900" />
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Features */}
                  <ul className="space-y-2">
                    {template.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="h-2 w-2 rounded-full bg-slate-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    onClick={() => navigate(`/romaneio/new?template=${template.id}`)}
                    className={`w-full text-white ${template.buttonColor}`}
                  >
                    Usar {template.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Dica</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700">
            <p>
              Você pode mudar de template a qualquer momento. Ambos os templates oferecem
              funcionalidades completas para gerenciar seus romaneios e obras com eficiência.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
