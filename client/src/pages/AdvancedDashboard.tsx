import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, Package, Users, FileText } from 'lucide-react';

const AdvancedDashboard = () => {
  // Dados de exemplo para gráficos
  const obrasData = [
    { name: 'Jan', obras: 4, concluidas: 2 },
    { name: 'Fev', obras: 6, concluidas: 4 },
    { name: 'Mar', obras: 8, concluidas: 6 },
    { name: 'Abr', obras: 10, concluidas: 8 },
    { name: 'Mai', obras: 12, concluidas: 9 },
    { name: 'Jun', obras: 14, concluidas: 12 },
  ];

  const statusData = [
    { name: 'Concluídas', value: 45, fill: '#10b981' },
    { name: 'Em Andamento', value: 35, fill: '#3b82f6' },
    { name: 'Planejadas', value: 20, fill: '#f59e0b' },
  ];

  const alertasData = [
    { id: 1, titulo: 'Atraso na Obra DUBAI LM', severidade: 'alta', data: '2026-02-27' },
    { id: 2, titulo: 'Falta de Materiais - Bloco A', severidade: 'média', data: '2026-02-26' },
    { id: 3, titulo: 'Inspeção Pendente - Pavimento 5', severidade: 'média', data: '2026-02-25' },
  ];

  const metricas = [
    { titulo: 'Total de Obras', valor: '14', icone: Package, cor: 'bg-blue-500' },
    { titulo: 'Obras Concluídas', valor: '12', icone: TrendingUp, cor: 'bg-green-500' },
    { titulo: 'Equipes Ativas', valor: '8', icone: Users, cor: 'bg-purple-500' },
    { titulo: 'Relatórios Pendentes', valor: '3', icone: FileText, cor: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Executivo</h1>
        <p className="text-gray-600 mt-2">Visão geral do desempenho das obras e operações</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((metrica, idx) => {
          const Icon = metrica.icone;
          return (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metrica.titulo}</CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrica.valor}</div>
                <p className="text-xs text-gray-500 mt-1">Atualizado hoje</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="obras" className="space-y-4">
        <TabsList>
          <TabsTrigger value="obras">Evolução de Obras</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="obras">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Obras nos Últimos 6 Meses</CardTitle>
              <CardDescription>Total de obras vs. obras concluídas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={obrasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="obras" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="concluidas" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Status</CardTitle>
                <CardDescription>Proporção de obras por status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Desempenho Mensal</CardTitle>
                <CardDescription>Taxa de conclusão por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={obrasData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="concluidas" fill="#10b981" />
                    <Bar dataKey="obras" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Críticos</CardTitle>
              <CardDescription>Situações que requerem atenção imediata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertasData.map((alerta) => (
                  <div
                    key={alerta.id}
                    className={`p-4 rounded-lg border-l-4 flex items-start gap-3 ${
                      alerta.severidade === 'alta'
                        ? 'bg-red-50 border-red-500'
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <AlertCircle
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        alerta.severidade === 'alta' ? 'text-red-500' : 'text-yellow-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alerta.titulo}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Severidade: {alerta.severidade.toUpperCase()} • {alerta.data}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDashboard;
