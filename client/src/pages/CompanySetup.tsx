import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Building2, FileText } from "lucide-react";

export default function CompanySetup() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<"blank" | "aluminc">("blank");
  const [formData, setFormData] = useState({
    companyName: "",
    documentNumber: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const setupMutation = trpc.company.setupCompany.useMutation();

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
    
    if (!formData.companyName.trim()) {
      toast.error("Nome da empresa é obrigatório");
      return;
    }

    setLoading(true);
    try {
      await setupMutation.mutateAsync({
        companyName: formData.companyName,
        documentNumber: formData.documentNumber || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        preferredTemplate: selectedTemplate,
      });
      toast.success("Empresa configurada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Erro ao configurar empresa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Configure sua Empresa
            </h1>
          </div>
          <p className="text-xl text-slate-600">
            Vamos começar! Informe os dados da sua empresa para usar a plataforma
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Estes dados serão usados como padrão nos seus romaneios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Nome da Empresa *
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Ex: Dubai LM Empreendimentos"
                  className="mt-2"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="documentNumber" className="text-sm font-medium">
                    CNPJ/CPF
                  </Label>
                  <Input
                    id="documentNumber"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    placeholder="00.000.000/0000-00"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  Endereço
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Avenida Lucianinho Melli, nº 444 - Vila Osasco"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Escolha seu Template</CardTitle>
              <CardDescription>
                Selecione como você quer começar a criar seus romaneios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedTemplate} onValueChange={(value: any) => setSelectedTemplate(value)}>
                {/* Blank Template */}
                <div className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="blank" id="blank" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="blank" className="text-base font-semibold cursor-pointer">
                      Versão em Branco
                    </Label>
                    <p className="text-sm text-slate-600 mt-1">
                      Comece do zero com um formulário vazio. Perfeito para criar romaneios personalizados.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Flexível
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Customizável
                      </span>
                    </div>
                  </div>
                </div>

                {/* Aluminc Template */}
                <div className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="aluminc" id="aluminc" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="aluminc" className="text-base font-semibold cursor-pointer">
                      Template Aluminc
                    </Label>
                    <p className="text-sm text-slate-600 mt-1">
                      Use o template pré-configurado com campos para contratante, responsável técnico, e mais. O nome da sua empresa aparecerá automaticamente.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Pré-configurado
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Profissional
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Completo
                      </span>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Preview */}
          {selectedTemplate === "aluminc" && (
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Preview do Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded border border-purple-200 text-sm space-y-2">
                  <div className="font-semibold text-slate-900">
                    {formData.companyName || "Sua Empresa"}
                  </div>
                  <div className="text-slate-600">
                    {formData.address || "Seu endereço aqui"}
                  </div>
                  <div className="text-slate-600">
                    CONTRATANTE: {formData.companyName || "Sua Empresa"}
                  </div>
                  <div className="text-slate-600">
                    RESPONSÁVEL TÉCNICO: [Campo a preenchimento]
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Configurando..." : "Continuar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
