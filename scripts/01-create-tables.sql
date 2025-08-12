-- Criar tabela de usuários com diferentes funções na igreja
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'pastor_presidente', 'pastor', 'supervisor', 'lider_celula', 'auxiliar', 'membro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de células
CREATE TABLE IF NOT EXISTS celulas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  lider_id UUID REFERENCES users(id),
  supervisor_id UUID REFERENCES users(id),
  endereco TEXT,
  dia_semana VARCHAR(20),
  horario TIME,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de membros das células
CREATE TABLE IF NOT EXISTS celula_membros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  celula_id UUID REFERENCES celulas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  data_entrada DATE DEFAULT CURRENT_DATE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(celula_id, user_id)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_celulas_lider ON celulas(lider_id);
CREATE INDEX IF NOT EXISTS idx_celulas_supervisor ON celulas(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_celula_membros_celula ON celula_membros(celula_id);
CREATE INDEX IF NOT EXISTS idx_celula_membros_user ON celula_membros(user_id);

-- Inserir usuário administrador padrão (você pode alterar os dados depois)
INSERT INTO users (email, username, full_name, role) 
VALUES ('admin@igreja.com', 'admin', 'Administrador do Sistema', 'admin')
ON CONFLICT (email) DO NOTHING;
