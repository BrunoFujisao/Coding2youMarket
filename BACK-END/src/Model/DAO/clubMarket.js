/*CREATE TABLE IF NOT EXISTS club_market (
  id SERIAL PRIMARY KEY,
  usuarioId INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  dataInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('ativa', 'cancelada', 'suspensa')),
  valorMensal DECIMAL(10, 2) DEFAULT 19.90
); */ 