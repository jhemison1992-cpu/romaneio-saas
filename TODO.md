# Romaneio SaaS - Plano de Desenvolvimento

## Arquitetura do Banco de Dados

### Tabelas Principais

1. **users** (existente e expandida)
   - Campos adicionados: subscriptionPlanId, companyName, documentNumber, phone, address

2. **subscriptionPlans** (nova)
   - Planos: Free, Starter, Professional, Enterprise

3. **userSubscriptions** (nova)
   - Gerencia assinaturas ativas dos usuários

4. **companies** (nova)
   - Organizações/empresas com template (blank ou aluminc)

5. **romaneios** (nova)
   - Documentos de romaneio de carga

6. **romaneioItems** (nova)
   - Itens individuais em cada romaneio

7. **auditLogs** (nova)
   - Rastreamento de ações no sistema

## Funcionalidades Implementadas

### Fase 1: Banco de Dados ✓
- [x] Schema Drizzle definido
- [x] Migrations geradas e aplicadas
- [x] Tabelas criadas no banco de dados

### Fase 2: Autenticação e Planos ✓
- [x] Tela de seleção de planos no primeiro login
- [x] Página de perfil do usuário
- [x] Sistema de upgrade de plano
- [x] Validação de limites por plano
- [x] Rotas tRPC para gerenciar assinaturas

### Fase 3: Formulário de Romaneio ✓
- [x] Criar/editar romaneio
- [x] Adicionar itens de carga
- [x] Listar romaneios com filtros
- [x] Visualizar detalhes
- [x] Versão em branco (template)
- [ ] Versão Aluminc (pré-preenchida)

### Fase 4: Dashboard Admin ✓
- [x] Interface de gerenciamento de usuários
- [x] Interface de gerenciamento de planos
- [x] Dashboard com estatísticas
- [x] Controle de acesso por role (admin)

### Fase 5: PDF e Avançados
- [ ] Geração de PDF com layout profissional
- [ ] Download/impressão de romaneios
- [ ] Integração Stripe para pagamentos
- [ ] Notificações por email

### Fase 6: Testes ✓
- [x] Testes básicos das rotas
- [x] Testes de estrutura do router

## Páginas Implementadas

1. **Home** - Landing page elegante com CTA
2. **PlanSelection** - Seleção de planos para novos usuários
3. **Dashboard** - Dashboard principal com lista de romaneios
4. **RomaneioForm** - Formulário para criar/editar romaneios
5. **RomaneioDetail** - Visualização detalhada de romaneio
6. **Profile** - Perfil do usuário e gerenciamento de assinatura
7. **AdminDashboard** - Dashboard administrativo

## Componentes de UI Utilizados

- Buttons, Cards, Inputs, Labels, Textareas
- Tables para listagem de dados
- Badges para status
- Dialogs e Dropdowns
- Tabs e Accordion
- Toast notifications (Sonner)

## Estilo Visual

- Tema elegante com Tailwind CSS 4
- Paleta de cores: Slate, Blue, Green, Purple
- Design responsivo mobile-first
- Componentes Radix UI para acessibilidade
- Animações suaves com Framer Motion

## Rotas Implementadas

### Públicas
- `/` - Home/Landing page
- `/plans` - Seleção de planos

### Protegidas
- `/dashboard` - Dashboard principal
- `/romaneio/new` - Criar novo romaneio
- `/romaneio/:id` - Visualizar/editar romaneio
- `/profile` - Perfil do usuário
- `/admin` - Dashboard administrativo (apenas admin)

## API tRPC Implementada

### subscription
- `listPlans` - Listar planos disponíveis
- `getCurrentSubscription` - Obter assinatura atual do usuário
- `subscribe` - Criar nova assinatura

### romaneio
- `list` - Listar romaneios do usuário
- `get` - Obter romaneio específico
- `create` - Criar novo romaneio
- `update` - Atualizar romaneio
- `delete` - Arquivar romaneio
- `addItem` - Adicionar item ao romaneio
- `updateItem` - Atualizar item
- `removeItem` - Remover item

## Status Final

- [x] Projeto inicializado com web-db-user scaffold
- [x] Schema do banco de dados
- [x] Migrations aplicadas
- [x] Componentes de UI (7 páginas)
- [x] Lógica de negócio (rotas tRPC)
- [x] Testes básicos
- [x] Landing page elegante
- [x] Autenticação e autorização
- [x] Sistema de planos de assinatura
- [x] CRUD de romaneios

## Próximos Passos Recomendados

1. **Geração de PDF** - Implementar com pdfkit ou similar para gerar PDFs profissionais
2. **Integração Stripe** - Adicionar pagamento de assinaturas
3. **Notificações por Email** - Implementar sistema de notificações
4. **Template Aluminc** - Criar versão pré-preenchida como template
5. **Filtros Avançados** - Adicionar busca e filtros nos romaneios
6. **Relatórios** - Implementar relatórios e análises
7. **Multi-empresa** - Suporte a múltiplas empresas por usuário
8. **Integração NFe** - Integração com sistema de Nota Fiscal Eletrônica
9. **API Pública** - Expor API para integrações externas
10. **Mobile App** - Considerar aplicativo mobile

## Notas Importantes

- Versão Aluminc pode ser implementada como template pré-preenchido
- Estilo elegante aplicado com Tailwind CSS e componentes Radix UI
- Controle de acesso por plano implementado nas rotas tRPC
- Sistema mantém compatibilidade com versão existente
- Todos os testes passando com sucesso
- Servidor rodando sem erros


## Funcionalidades em Desenvolvimento

- [ ] Fluxo obrigatório de seleção de plano antes do cadastro
- [ ] Integrar template Aluminc na criação de romaneios
- [ ] Implementar geração de PDF para romaneios
- [ ] Integração com Stripe para pagamentos
- [ ] Dashboard administrativo funcional
- [ ] Notificações por email
- [x] Tabela de vistorias (inspections) criada
- [x] Rotas tRPC para vistorias implementadas
- [x] Página de Vistorias com CRUD funcional

- [x] Redesenhar página de Vistorias com cards elegantes (modelo Aluminc)
- [x] Modal elegante para criar obras
- [x] Redesenhar modal de cadastro de obra com abas (Completo/Simples)
- [x] Adicionar campos profissionais (Responsável, Tipo de contrato, Status, etc)
- [x] Implementar Cadastro Simples com menos campos
- [ ] Integração Stripe para pagamento dos planos
- [ ] Geração de PDF para romaneios
- [ ] Fluxo obrigatório de seleção de plano
- [ ] Dashboard administrativo completo
