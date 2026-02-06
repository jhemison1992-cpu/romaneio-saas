-- Inserir usuário teste
INSERT INTO users (openId, name, email, loginMethod, role, companyName, documentNumber, phone, address, preferredTemplate, createdAt, updatedAt, lastSignedIn) 
VALUES ('test-user-001', 'João Silva Teste', 'joao@teste.com', 'oauth', 'user', 'ALUMINC Teste', '12345678000190', '11987654321', 'Rua Teste, 123', 'blank', NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);

-- Armazenar ID do usuário
SET @userId = LAST_INSERT_ID();

-- Inserir empresa teste
INSERT INTO companies (ownerId, name, documentNumber, address, phone, email, template, createdAt, updatedAt)
VALUES (@userId, 'ALUMINC Teste LTDA', '12345678000190', 'Rua Teste, 123 - São Paulo, SP', '11987654321', 'contato@aluminc-teste.com', 'aluminc', NOW(), NOW());

SET @companyId = LAST_INSERT_ID();

-- Inserir obra teste
INSERT INTO romaneios (userId, companyId, title, remetente, destinatario, dataEmissao, status, observacoes, createdAt, updatedAt)
VALUES (@userId, @companyId, 'Obra Teste - Instalação de Janelas', 'ALUMINC Teste', 'Cliente Teste LTDA', NOW(), 'completed', 'Obra teste para validação do sistema', NOW(), NOW());

-- Inserir vistoria teste
INSERT INTO inspections (userId, companyId, title, location, date, status, notes, createdAt, updatedAt)
VALUES (@userId, @companyId, 'Vistoria de Conclusão - Obra Teste', 'Bloco A - Pavimento 5', NOW(), 'completed', 'Vistoria teste para validar termo de entrega', NOW(), NOW());

SET @inspectionId = LAST_INSERT_ID();

-- Inserir termo de entrega teste
INSERT INTO deliveryTerms (inspectionId, userId, companyId, protocolNumber, completionDate, responsibleTechnician, description, status, createdAt, updatedAt)
VALUES (@inspectionId, @userId, @companyId, CONCAT('TERMO-', UNIX_TIMESTAMP(NOW()), '-', FLOOR(RAND()*10000)), NOW(), 'Eng. Carlos Santos', 'Vistoria de conclusão realizada com sucesso. Todos os itens foram verificados e aprovados.', 'draft', NOW(), NOW());

-- Verificar dados criados
SELECT 'Usuários criados:' as info;
SELECT id, name, email, companyName FROM users WHERE openId = 'test-user-001';

SELECT 'Empresas criadas:' as info;
SELECT id, name, ownerId FROM companies WHERE ownerId = @userId;

SELECT 'Obras criadas:' as info;
SELECT id, title, userId FROM romaneios WHERE userId = @userId;

SELECT 'Vistorias criadas:' as info;
SELECT id, title, userId FROM inspections WHERE userId = @userId;

SELECT 'Termos de entrega criados:' as info;
SELECT id, protocolNumber, responsibleTechnician FROM deliveryTerms WHERE userId = @userId;
