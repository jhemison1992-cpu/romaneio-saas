# Romaneio SaaS - Plano de Desenvolvimento

## Arquitetura do Banco de Dados

### Tabelas Principais

1. **users** (existente)
   - id, openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn
   - Adicionar: subscriptionPlanId, companyName, documentNumber, phone, address

2. **subscriptionPlans** (nova)
   - id, name, slug, description, monthlyPrice, features (JSON), maxRomaneios, maxUsers, isActive
   - Planos: Free, Starter, Professional, Enterprise

3. **userSubscriptions** (nova)
   - id, userId, planId, startDate, endDate, status (active, cancelled, expired), autoRenew

4. **romaneios** (nova)
   - id, userId, companyId, title, remetente, destinatario, dataEmissao, status (draft, completed, archived)
   - Template: blank (vazio para venda) ou aluminc (pré-preenchido)

5. **romaneioItems** (nova)
   - id, romaneioId, descricao, quantidade, peso, unidade, valor

6. **companies** (nova)
   - id, ownerId, name, documentNumber, address, phone, email, template (blank/aluminc)

7. **auditLog** (nova)
   - id, userId, action, entityType, entityId, changes, timestamp

## Funcionalidades por Fase

### Fase 1: Banco de Dados ✓
- [x] Definir schema Drizzle
- [ ] Gerar migrations
- [ ] Aplicar migrations no banco

### Fase 2: Autenticação e Planos
- [ ] Tela de seleção de planos no primeiro login
- [ ] Página de perfil do usuário
- [ ] Sistema de upgrade de plano
- [ ] Validação de limites por plano

### Fase 3: Formulário de Romaneio
- [ ] Criar/editar romaneio
- [ ] Adicionar itens de carga
- [ ] Listar romaneios com filtros
- [ ] Visualizar detalhes
- [ ] Versão em branco (template)
- [ ] Versão Aluminc (pré-preenchida)

### Fase 4: Dashboard Admin
- [ ] Gerenciar usuários
- [ ] Gerenciar planos
- [ ] Visualizar estatísticas
- [ ] Controle de acesso por role

### Fase 5: PDF e Avançados
- [ ] Geração de PDF de romaneios
- [ ] Layout profissional
- [ ] Download/impressão

### Fase 6: Testes
- [ ] Testar autenticação
- [ ] Testar planos e limites
- [ ] Testar CRUD de romaneios
- [ ] Testar PDF

## Status de Desenvolvimento

- [x] Projeto inicializado com web-db-user scaffold
- [x] Schema do banco de dados
- [x] Migrations aplicadas
- [x] Componentes de UI (PlanSelection, Dashboard, RomaneioForm)
- [x] Lógica de negócio (rotas tRPC)
- [x] Testes básicos
- [ ] Geração de PDF
- [ ] Dashboard administrativo
- [ ] Controle de acesso avançado
- [ ] Deploy

## Notas Importantes

- Manter versão Aluminc intacta e separada
- Aplicar estilo elegante e profissional
- Implementar controle de acesso por plano
- Gerar PDFs com layout profissional
