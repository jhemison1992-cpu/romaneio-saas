import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Alerts = () => {
  const [alertas, setAlertas] = useState([
    {
      id: 1,
      titulo: 'Atraso na Obra DUBAI LM',
      descricao: 'A obra está 5 dias atrasada em relação ao cronograma',
      severidade: 'alta',
      tipo: 'atraso',
      data: '2026-02-27',
      lido: false,
    },
    {
      id: 2,
      titulo: 'Falta de Materiais - Bloco A',
      descricao: 'Vidros temperados não chegaram conforme previsto',
      severidade: 'média',
      tipo: 'material',
      data: '2026-02-26',
      lido: false,
    },
    {
      id: 3,
      titulo: 'Inspeção Pendente - Pavimento 5',
      descricao: 'Vistoria de conclusão aguardando agendamento',
      severidade: 'média',
      tipo: 'inspeção',
      data: '2026-02-25',
      lido: true,
    },
    {
      id: 4,
      titulo: 'Conclusão da Obra - Bloco B',
      descricao: 'Bloco B foi concluído com sucesso',
      severidade: 'baixa',
      tipo: 'sucesso',
      data: '2026-02-24',
      lido: true,
    },
  ]);

  const handleMarcarLido = (id: number) => {
    setAlertas(alertas.map(a => a.id === id ? { ...a, lido: !a.lido } : a));
  };

  const handleDeletar = (id: number) => {
    setAlertas(alertas.filter(a => a.id !== id));
  };

  const getIcone = (severidade: string) => {
    switch (severidade) {
      case 'alta':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'média':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'baixa':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getCor = (severidade: string) => {
    switch (severidade) {
      case 'alta':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'média':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'baixa':
        return 'bg-blue-50 border-l-4 border-blue-500';
      default:
        return 'bg-green-50 border-l-4 border-green-500';
    }
  };

  const alertasNaoLidos = alertas.filter(a => !a.lido).length;

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alertas do Sistema</h1>
          <p className="text-gray-600 mt-2">
            Você tem {alertasNaoLidos} alerta{alertasNaoLidos !== 1 ? 's' : ''} não lido{alertasNaoLidos !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm">
          Todos ({alertas.length})
        </Button>
        <Button variant="outline" size="sm">
          Não Lidos ({alertasNaoLidos})
        </Button>
        <Button variant="outline" size="sm">
          Críticos ({alertas.filter(a => a.severidade === 'alta').length})
        </Button>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-3">
        {alertas.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">Nenhum alerta no momento</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          alertas.map((alerta) => (
            <div
              key={alerta.id}
              className={`p-4 rounded-lg ${getCor(alerta.severidade)} ${
                !alerta.lido ? 'ring-2 ring-offset-2 ring-gray-400' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {getIcone(alerta.severidade)}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-medium ${!alerta.lido ? 'text-gray-900' : 'text-gray-700'}`}>
                        {alerta.titulo}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{alerta.descricao}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-gray-500">{alerta.data}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      alerta.severidade === 'alta' ? 'bg-red-200 text-red-800' :
                      alerta.severidade === 'média' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {alerta.severidade.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarcarLido(alerta.id)}
                  >
                    {alerta.lido ? 'Marcar como Não Lido' : 'Marcar como Lido'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeletar(alerta.id)}
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
