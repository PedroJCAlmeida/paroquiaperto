-- Criação das tabelas de distritos e conselhos
CREATE TABLE distritos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE conselhos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    distrito_id INTEGER NOT NULL REFERENCES distritos(id)
);

-- Alteração da tabela paroquias para usar chaves estrangeiras
ALTER TABLE paroquias
ADD COLUMN distrito_id INTEGER REFERENCES distritos(id),
ADD COLUMN conselho_id INTEGER REFERENCES conselhos(id);

-- Remover colunas antigas se já existirem
ALTER TABLE paroquias
DROP COLUMN IF EXISTS distrito,
DROP COLUMN IF EXISTS conselho;