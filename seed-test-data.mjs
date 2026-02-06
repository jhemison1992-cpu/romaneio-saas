import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/')[3]?.split('?')[0] || 'test_db',
});

try {
  console.log('Conectando ao banco de dados...');
  
  // Inserir usuário teste
  const [userResult] = await connection.execute(
    `INSERT INTO users (openId, name, email, loginMethod, role, companyName, documentNumber, phone, address, preferredTemplate, createdAt, updatedAt, lastSignedIn) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
     ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
    ['test-user-001', 'João Silva Teste', 'joao@teste.com', 'oauth', 'user', 'ALUMINC Teste', '12345678000190', '11987654321', 'Rua Teste, 123', 'blank']
  );
  
  const userId = userResult.insertId || 1;
  console.log(`✓ Usuário criado/atualizado: ID ${userId}`);

  // Inserir empresa teste
  const [companyResult] = await connection.execute(
    `INSERT INTO companies (ownerId, name, documentNumber, address, phone, email, template, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [userId, 'ALUMINC Teste LTDA', '12345678000190', 'Rua Teste, 123 - São Paulo, SP', '11987654321', 'contato@aluminc-teste.com', 'aluminc']
  );
  
  const companyId = companyResult.insertId;
  console.log(`✓ Empresa criada: ID ${companyId}`);

  // Inserir obra teste
  const [romaneioResult] = await connection.execute(
    `INSERT INTO romaneios (userId, companyId, title, remetente, destinatario, dataEmissao, status, observacoes, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, NOW(), NOW())`,
    [userId, companyId, 'Obra Teste - Instalação de Janelas', 'ALUMINC Teste', 'Cliente Teste LTDA', 'completed', 'Obra teste para validação do sistema']
  );
  
  const romaneioId = romaneioResult.insertId;
  console.log(`✓ Obra criada: ID ${romaneioId}`);

  // Inserir vistoria teste
  const [inspectionResult] = await connection.execute(
    `INSERT INTO inspections (userId, companyId, title, location, date, status, notes, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, NOW(), ?, ?, NOW(), NOW())`,
    [userId, companyId, 'Vistoria de Conclusão - Obra Teste', 'Bloco A - Pavimento 5', 'completed', 'Vistoria teste para validar termo de entrega']
  );
  
  const inspectionId = inspectionResult.insertId;
  console.log(`✓ Vistoria criada: ID ${inspectionId}`);

  // Inserir termo de entrega teste
  const protocolNumber = `TERMO-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const [termResult] = await connection.execute(
    `INSERT INTO deliveryTerms (inspectionId, userId, companyId, protocolNumber, completionDate, responsibleTechnician, description, status, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, NOW(), NOW())`,
    [inspectionId, userId, companyId, protocolNumber, 'Eng. Carlos Santos', 'Vistoria de conclusão realizada com sucesso. Todos os itens foram verificados e aprovados.', 'draft']
  );
  
  const termId = termResult.insertId;
  console.log(`✓ Termo de entrega criado: ID ${termId}`);
  console.log(`  Protocolo: ${protocolNumber}`);

  console.log('\n✅ Dados de teste criados com sucesso!');
  console.log(`\nDados para teste:\n`);
  console.log(`  Usuário ID: ${userId}`);
  console.log(`  Empresa ID: ${companyId}`);
  console.log(`  Obra ID: ${romaneioId}`);
  console.log(`  Vistoria ID: ${inspectionId}`);
  console.log(`  Termo ID: ${termId}`);

} catch (error) {
  console.error('❌ Erro ao criar dados de teste:', error.message);
} finally {
  await connection.end();
}
