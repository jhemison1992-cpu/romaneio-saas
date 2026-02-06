# Romaneio SaaS - Sistema de Gestão de Obras - TODO

## Autenticação e Acesso
- [x] Sistema de autenticação com OAuth Manus
- [x] Níveis de acesso (usuário/admin)
- [x] Página de login e logout
- [x] Proteção de rotas autenticadas

## Landing Page e Preços
- [x] Landing page moderna com hero section
- [x] Página de preços com planos pagos
- [x] Planos: Starter (R$ 79,90/mês), Professional (R$ 159,80/mês), Enterprise
- [x] Design moderno com gradientes azul-indigo
- [x] Animações hover nos cards

## Dashboard
- [x] Dashboard principal com listagem de obras
- [x] Navegação mostrando nome da empresa
- [x] Cards elegantes em grid responsivo
- [x] Modal de cadastro de obras com abas (Completo/Simples)
- [x] Campos avançados no formulário de obras

## Vistorias (Inspections)
- [x] Página de Vistorias com cards elegantes
- [x] Status coloridos (Em Andamento, Concluída, Cancelada)
- [x] Formulário de criação de vistorias
- [x] Página de detalhes de vistoria com abas
- [x] Edição de dados de vistoria
- [x] Rota de detalhes: /inspections/:id

## Termo de Entrega (Delivery Terms)
- [x] Tabela no banco de dados (deliveryTerms)
- [x] Funções de CRUD no db-features.ts
- [x] Rotas tRPC para gerenciar termos
- [x] Geração de número de protocolo único
- [x] Geração de PDF profissional com PDFKit
- [x] Componente DeliveryTermsTab para visualização
- [x] Aba "Termos de Entrega" na página de detalhes
- [x] Endpoint API GET /api/deliveryTerms/:id/pdf
- [x] Endpoint API POST /api/deliveryTerms/:id/upload-pdf
- [x] Upload de PDF para S3
- [x] Testes vitest para geração de protocolo

## Gerenciamento de Usuários
- [x] Página de gerenciamento de usuários
- [x] Listagem de usuários da equipe
- [x] Funcionalidades básicas de CRUD

## Templates
- [x] Sistema de templates (em branco vs Aluminc)
- [x] Página de seleção de template
- [x] CompanySetup com informações da empresa
- [x] Nome da empresa aparece no template Aluminc

## Integração Stripe
- [x] Tabelas de stripeSubscriptions
- [x] Rotas tRPC para checkout
- [x] Cancelamento de assinatura
- [x] Verificação de status de assinatura
- [ ] Webhook endpoint para eventos Stripe
- [ ] Processamento de checkout.session.completed
- [ ] Fluxo obrigatório de seleção de plano

## Melhorias Adicionais
- [ ] Animações de página com Framer Motion
- [ ] Filtros e busca nas páginas de Obras e Vistorias
- [ ] Dashboard administrativo funcional
- [ ] Gerenciamento de receitas
- [ ] Modal automático ao completar vistoria 100%
- [ ] Assinatura digital para termos de entrega

## Testes
- [x] Testes vitest para geração de protocolo
- [ ] Testes para CRUD de termos de entrega
- [ ] Testes para geração de PDF
- [ ] Testes para endpoints API
- [ ] Testes de integração com Stripe

## Documentação
- [ ] README com instruções de setup
- [ ] Documentação de API
- [ ] Guia de uso do sistema

## Deploy e Produção
- [ ] Configuração de variáveis de ambiente
- [ ] Otimização de performance
- [ ] Configuração de CDN para assets
- [ ] Backup e recuperação de dados
