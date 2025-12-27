-- ==========================================
-- MIGRATION: ADD ROLE COLUMN TO USUARIOS
-- ==========================================

-- Adicionar coluna role à tabela usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Comentário da coluna
COMMENT ON COLUMN usuarios.role IS 'Papel do usuário no sistema: user ou admin';

-- Criar index para melhor performance em queries de admin
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);

-- Atualizar um usuário específico para admin (se necessário)
-- SUBSTITUA 'seu-email@example.com' pelo email do admin
UPDATE usuarios 
SET role = 'admin' 
WHERE email = 'admin@subscrivery.com'
  AND role != 'admin';

-- Se não existir nenhum admin, crie um usuário admin de teste
-- IMPORTANTE: Alterar a senha em produção!
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM usuarios WHERE role = 'admin') THEN
    INSERT INTO usuarios (nome, email, senha, ativo, role)
    VALUES (
      'Administrador',
      'admin@subscrivery.com',
      '$2b$10$rZ.xKc6b5vGJwk7DZyZ5r.eH2XdZ9Yh0dGJ8KZq2L0wZ4Q2yN0Y3S', -- senha: admin123
      true,
      'admin'
    )
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;

-- Verificar se foi criado
SELECT id, nome, email, role 
FROM usuarios 
WHERE role = 'admin';
